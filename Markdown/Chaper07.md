# Chaper 07: Xử lý lỗi
## Michael Feathers
![Image tilte](https://raw.githubusercontent.com/chukimmuoi/Clean-Code---Tieng-Viet/master/image/chap07_image01.png)

Có vẻ kỳ lạ khi có một phần về xử lý lỗi trong một cuốn sách về mã sạch. Xử lý lỗi chỉ là một trong những việc mà tất cả chúng ta phải làm khi lập trình. Đầu vào có thể bất thường và thiết bị có thể bị lỗi. Nói tóm lại, mọi thứ có thể xảy ra sai sót, và khi chúng xảy ra, chúng ta với tư cách là người lập trình có trách nhiệm đảm bảo rằng mã của chúng ta thực hiện những gì nó cần làm.    

Tuy nhiên, kết nối với mã sạch phải rõ ràng. Nhiều cơ sở mã bị chi phối hoàn toàn bởi việc xử lý lỗi. Khi tôi nói bị chi phối, tôi không có ý nói rằng lỗi chỉ là tất cả những gì họ làm. Ý tôi là gần như không thể thấy mã làm gì vì tất cả các lỗi xử lý rải rác. Xử lý lỗi là quan trọng, *nhưng nếu nó che khuất logic thì đó là sai*.

Trong chương này, tôi sẽ trình bày một số kỹ thuật và cân nhắc mà bạn có thể sử dụng để viết mã vừa rõ ràng vừa mạnh mẽ — mã xử lý lỗi một cách duyên dáng và đúng phong cách.

## Sử dụng ngoại lệ thay vì trả lại mã   
Trong quá khứ xa xôi, có rất nhiều ngôn ngữ không có ngoại lệ. Trong các ngôn ngữ đó, các kỹ thuật xử lý và báo cáo lỗi bị hạn chế. Bạn đặt cờ lỗi hoặc trả lại mã lỗi mà người gọi có thể kiểm tra. Mã trong Liệt kê 7-1 minh họa những cách tiếp cận này.
**Listing 7-1**
**DeviceController.java**
```java
public class DeviceController { 
    ...
    public void sendShutDown() { DeviceHandle handle = getHandle(DEV1); // Check the state of the device
    if (handle != DeviceHandle.INVALID) {
        // Save the device status to the record field retrieveDeviceRecord(handle);
        // If not suspended, shut down
        if (record.getStatus() != DEVICE_SUSPENDED) {
            pauseDevice(handle); clearDeviceWorkQueue(handle); closeDevice(handle);
        } else {
            logger.log("Device suspended. Unable to shut down");
        }
    } else {
        logger.log("Invalid handle for: " + DEV1.toString()); }
    } 
    ...
}
```
Vấn đề với những cách tiếp cận này là chúng làm lộn xộn người gọi. Người gọi phải kiểm tra lỗi ngay sau cuộc gọi. Thật không may, nó rất dễ quên. Đối với trường hợp này, tốt hơn là bạn nên ném một ngoại lệ khi bạn gặp lỗi. Mã gọi sạch hơn. Logic của nó không bị che khuất bởi việc xử lý lỗi.   
Liệt kê 7-2 hiển thị mã sau khi chúng tôi đã chọn đưa ra các ngoại lệ trong các phương pháp có thể phát hiện lỗi.
**Listing 7-2**
**DeviceController.java (with exceptions)**
```java
public class DeviceController { 
    ...
    public void sendShutDown() {
        try {
            tryToShutDown();
        } catch (DeviceShutDownError e) {
            logger.log(e); }
        }
        
    private void tryToShutDown() throws DeviceShutDownError {
        DeviceHandle handle = getHandle(DEV1);
        DeviceRecord record = retrieveDeviceRecord(handle);
        pauseDevice(handle); 
        clearDeviceWorkQueue(handle); 
        closeDevice(handle);
    }
    
    private DeviceHandle getHandle(DeviceID id) {
        ...
        throw new DeviceShutDownError("Invalid handle for: " + id.toString()); 
        ...
    }
    ...
}
```
Để ý xem nó sạch hơn bao nhiêu. Đây không chỉ là vấn đề thẩm mỹ. Mã này tốt hơn vì hai mối quan tâm bị rối, thuật toán tắt thiết bị và xử lý lỗi, giờ đã được tách biệt. Bạn có thể xem xét từng mối quan tâm đó và hiểu chúng một cách độc lập.
## Viết tuyên bố Try-Catch-Finally cùng của bạn trước
Một trong những điều thú vị nhất về các ngoại lệ là chúng xác định phạm vi trong chương trình của bạn. Khi bạn thực thi mã trong phần **try** của câu lệnh **try-catch-finally**, bạn đang nói rằng việc thực thi có thể xẩy ra lỗi tại bất kỳ thời điểm nào và sau đó mã trong **catch** sẽ được thực thi.

Theo một cách nào đó, các khối **try** giống như các giao dịch. **catch** đảm bảo để chương trình của bạn ở trạng thái không bị gián đoạn, bởi bất kể điều gì xảy ra trong **try**. Vì lý do này, bạn nên bắt đầu bằng câu lệnh **try-catch-final** khi bạn viết mã, nó có thể đưa ra các ngoại lệ. Điều này giúp bạn xác định người dùng mã đó sẽ mong đợi điều gì khi xẩy ra lỗi với mã được thực thi trong **try**.

Hãy xem một ví dụ. Chúng ta cần viết một số mã truy cập tệp và đọc một số đối tượng được serialized.
Chúng tôi bắt đầu với unit test cho thấy rằng chúng tôi sẽ nhận được một ngoại lệ khi tệp không tồn tại:
```java
@Test(expected = StorageException.class)
public void retrieveSectionShouldThrowOnInvalidFileName() {
    sectionStore.retrieveSection("invalid - file"); 
}
```
Việc kiểm tra thúc đẩy chúng tôi tạo ra sơ khai này:
```java
public List<RecordedGrip> retrieveSection(String sectionName) { 
    // dummy return until we have a real implementation
    return new ArrayList<RecordedGrip>();
}
```
Thử nghiệm của chúng tôi không thành công vì nó không có ngoại lệ. Tiếp theo, chúng tôi thay đổi triển khai của chúng tôi để nó cố gắng truy cập một tệp không hợp lệ. Thao tác này đưa ra một ngoại lệ:
```java
public List<RecordedGrip> retrieveSection(String sectionName) { 
    try {
        FileInputStream stream = new FileInputStream(sectionName);
    } catch (Exception e) {
        throw new StorageException("retrieval error", e); 
    }
    return new ArrayList<RecordedGrip>();
}
```
Chúng tôi hiện đã vượt qua bài kiểm tra vì chúng tôi đã phát hiện ra ngoại lệ. Tại thời điểm này, chúng ta có thể tham khảo lại. Chúng tôi có thể thu hẹp loại ngoại lệ mà chúng tôi bắt được để phù hợp với loại thực sự được đưa ra từ phương thức khởi tạo của **FileInputStream**: **FileNotFoundException**:
```java
public List<RecordedGrip> retrieveSection(String sectionName) { 
    try {
        FileInputStream stream = new FileInputStream(sectionName);
        stream.close();
    } catch (FileNotFoundException e) {
        throw new StorageException("retrieval error”, e); 
    }
    return new ArrayList<RecordedGrip>(); 
}
```
Bây giờ chúng ta đã xác định phạm vi với cấu trúc **try-catch**, chúng ta có thể sử dụng TDD để xây dựng phần còn lại của logic mà chúng ta cần. Logic đó sẽ được thêm vào giữa quá trình tạo **FileInputStream** và **close**, và có thể giả vờ rằng không có gì sai.

Cố gắng viết các bài kiểm tra buộc xảy ra các trường hợp ngoại lệ, sau đó thêm hành vi vào trình xử lý của bạn để điều chỉnh các bài kiểm tra của bạn. Điều này sẽ khiến bạn phải xây dựng phạm vi giao dịch của khối **try** trước và sẽ giúp bạn duy trì bản chất giao dịch của phạm vi đó.
## Sử dụng Unchecked Exceptions
Cuộc tranh luận kết thúc. Trong nhiều năm, các lập trình viên Java đã tranh luận về lợi ích và mối quan hệ của các **checked exceptions**. Khi các **checked exceptions** được giới thiệu trong phiên bản Java đầu tiên, chúng dường như là một ý tưởng tuyệt vời. Chữ ký của mọi phương thức sẽ liệt kê tất cả các ngoại lệ mà nó có thể chuyển cho trình gọi của nó. Hơn nữa, những ngoại lệ này là một phần của loại phương pháp. Mã của bạn thực sự sẽ không biên dịch nếu chữ ký không khớp với những gì mã của bạn có thể làm.

Vào thời điểm đó, chúng tôi nghĩ rằng các **checked exceptions** là một ý tưởng tuyệt vời; và tất nhiên, chúng có thể mang lại *một số* lợi ích. Tuy nhiên, rõ ràng là giờ đây chúng không còn cần thiết để phát triển phần mềm. C# không có các **checked exceptions** và bất chấp mọi nỗ lực, C++ cũng không. Python hay Ruby cũng vậy. Tuy nhiên, có thể viết phần bằng tất cả các ngôn ngữ này. Do đó, chúng tôi phải quyết định - thực sự - liệu các **checked exceptions** có xứng đáng với cái giá của chúng hay không.
### Định nghĩa lớp Exception trong điều khoản về nhu cầu của người gọi
Giá bao nhiêu? Giá của các trường hợp **checked exceptions** là vi phạm Nguyên tắc Mở/Đóng. Nếu bạn ném một **checked exceptions** từ một phương thức trong mã của bạn và lệnh **catch** ở ba mức trên, *bạn phải khai báo ngoại lệ đó trong chữ ký của mỗi phương thức giữa bạn và lệnh* **catch**. Điều này có nghĩa là một thay đổi ở cấp thấp của phần mềm có thể buộc phải thay đổi chữ ký ở nhiều cấp cao hơn. Các mô-đun đã thay đổi phải được xây dựng lại và triển khai lại, mặc dù không có gì họ quan tâm đến đã thay đổi.

Xem xét hệ thống phân cấp gọi của một hệ thống lớn. Các hàm ở trên cùng gọi các hàm bên dưới chúng, gọi tiếp các hàm khác bên dưới chúng, vv... Bây giờ, giả sử một trong những hàm cấp thấp nhất được sửa đổi theo cách mà nó phải đưa ra một ngoại lệ. Nếu ngoại lệ đó được chọn, thì chữ ký hàm phải thêm một mệnh đề **throws**. Nhưng điều này có nghĩa là mọi hàm gọi hàm đã sửa đổi của chúng ta cũng phải được sửa đổi để bắt được ngoại lệ mới hoặc để nối mệnh đề **throws** thích hợp vào chữ ký của nó. vv... Kết quả thực là một loạt các thay đổi hoạt động theo cách của chúng từ mức thấp nhất của phần mềm đến mức cao nhất! Tính năng đóng gói bị phá vỡ bởi vì tất cả các hàm trong đường dẫn của một lần ném phải biết về chi tiết của ngoại lệ cấp thấp đó. Vì mục đích của các ngoại lệ là cho phép bạn xử lý lỗi ở khoảng cách xa, thật đáng tiếc khi các **checked exceptions** phá vỡ tính đóng gói theo cách này.

**checked exceptions** đôi khi có thể hữu ích nếu bạn đang viết thư viện quan trọng: Bạn phải **catch** chúng. Nhưng trong phát triển ứng dụng nói chung, chi phí phụ thuộc lớn hơn lợi ích mà nó đem lại.

## Cung cấp ngữ cảnh có ngoại lệ
Mỗi ngoại lệ mà bạn đưa ra phải cung cấp đủ ngữ cảnh để xác định nguồn và vị trí của lỗi. Trong Java, bạn có thể lấy dấu vết ngăn xếp từ bất kỳ ngoại lệ nào; tuy nhiên, dấu vết ngăn xếp không thể cho bạn biết mục đích của hoạt động không thành công.

Tạo thông báo lỗi đầy đủ thông tin và chuyển chúng cùng với các ngoại lệ của bạn. Đề cập đến hoạt động không thành công và loại lỗi. Nếu bạn đang logging ứng dụng của mình, hãy chuyển đủ thông tin để có thể ghi lại lỗi trong lần **catch** của bạn.

## Xác định các loại ngoại lệ trong điều khoản nhu cầu của người gọi
Có nhiều cách phân loại lỗi. Chúng ta có thể phân loại chúng theo nguồn của chúng: Chúng đến từ thành phần này hay thành phần khác? Hoặc loại của chúng: Chúng bị lỗi thiết bị, lỗi mạng, hoặc lỗi lập trình? Tuy nhiên, khi chúng ta xác định các lớp ngoại lệ trong một ứng dụng, mối quan tâm quan trọng nhất của chúng ta là **cách chúng được bắt**.

Hãy xem một ví dụ về phân loại ngoại lệ kém. Đây là câu lệnh **try-catch-finally** cho lệnh gọi thư viện của bên thứ ba. Nó bao gồm tất cả các ngoại lệ mà các cuộc gọi có thể ném ra:
```java
    ACMEPort port = new ACMEPort(12);
    try { 
        port.open();
    } catch (DeviceResponseException e) { 
        reportPortError(e);
        logger.log("Device response exception", e);
    } catch (ATM1212UnlockedException e) { 
        reportPortError(e); 
        logger.log("Unlock exception", e);
    } catch (GMXError e) { 
        reportPortError(e);
        logger.log("Device response exception");
    } finally { 
        ...
    }
```
Tuyên bố đó chứa đựng rất nhiều sự trùng lặp và chúng ta không nên ngạc nhiên. Trong hầu hết các tình huống xử lý ngoại lệ, công việc mà chúng tôi thực hiện tương đối chuẩn, bất kể nguyên nhân thực tế là gì. Chúng tôi phải ghi lại một lỗi và đảm bảo rằng chúng tôi có thể tiếp tục.

Trong trường hợp này, bởi vì chúng tôi biết rằng công việc chúng tôi đang làm gần như giống nhau bất kể ngoại lệ, chúng tôi có thể đơn giản hóa mã của mình đáng kể bằng cách gói API mà chúng tôi đang gọi và đảm bảo rằng nó trả về một loại ngoại lệ chung:
```java
    LocalPort port = new LocalPort(12); 
    try {
        port.open();
    } catch (PortDeviceFailure e) {
        reportError(e);
        logger.log(e.getMessage(), e);
    } finally {
        ...
    }
```
Lớp **LocalPort** của chúng tôi chỉ là một trình bao bọc đơn giản giúp bắt và dịch các ngoại lệ được ném bởi lớp **ACMEPort**:
```java
public class LocalPort {
    private ACMEPort innerPort;
    public LocalPort(int portNumber) { 
        innerPort = new ACMEPort(portNumber);
    }
    public void open() { 
        try {
            innerPort.open();
        } catch (DeviceResponseException e) {
            throw new PortDeviceFailure(e);
        } catch (ATM1212UnlockedException e) {
            throw new PortDeviceFailure(e);
        } catch (GMXError e) {
            throw new PortDeviceFailure(e);
        } 
    }
    ...
}
```
Các trình gói như chúng tôi đã xác định cho **ACMEPort** có thể rất hữu ích. Trên thực tế, gói các API của bên thứ ba là một phương pháp hay nhất. Khi bạn bọc một API của bên thứ ba, bạn giảm thiểu sự phụ thuộc của mình vào nó: Bạn có thể chọn chuyển sang một thư viện khác trong tương lai mà không bị phạt nhiều. Gói cũng giúp bạn dễ dàng bắt chước các cuộc gọi của bên thứ ba hơn khi bạn đang kiểm tra mã của riêng mình.

Một lợi thế cuối cùng của gói là bạn không bị ràng buộc với các lựa chọn thiết kế API của một nhà cung cấp cụ thể. Bạn có thể xác định một API mà bạn cảm thấy thoải mái. Trong ví dụ trước, chúng tôi đã xác định một loại ngoại lệ duy nhất cho lỗi thiết bị **port** và nhận thấy rằng chúng tôi có thể viết mã sạch hơn nhiều.

Thường thì một lớp ngoại lệ duy nhất là tốt cho một vùng mã cụ thể. Thông tin được gửi với ngoại lệ có thể phân biệt các lỗi. Chỉ sử dụng các lớp khác nhau nếu đôi khi bạn muốn bắt một ngoại lệ và cho phép ngoại lệ khác đi qua.
