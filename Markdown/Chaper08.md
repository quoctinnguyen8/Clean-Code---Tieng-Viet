# Ranh giới
## by James Grenning
![Image tilte_1](../image/chap08_image01.png)
Chúng ta hiếm khi kiểm soát hoàn toàn các phần mềm trong hệ thống của mình. Đôi khi chúng ta mua gói của bên thứ ba hoặc sử dụng mã nguồn mở. Những lần khác, chúng ta phụ thuộc vào các nhóm trong công ty để sản xuất các thành phần hoặc hệ thống con. Bằng cách nào đó, chúng ta phải tích hợp các mã ngoài này với mã riêng của chúng ta một cách rõ ràng. Trong chương này, chúng ta sẽ xem xét các phương pháp và kỹ thuật để giữ cho ranh giới của phần mềm của chúng ta được sạch sẽ.

## Sử dụng mã của bên thứ ba
Có một vấn đề giữa nhà cung cấp **interface** và người sử dụng **interface** . Các nhà cung cấp các packages và frameworks bên thứ ba cố gắng mang lại khả năng ứng dụng rộng rãi để họ có thể hoạt động trong nhiều môi trường và thu hút nhiều đối tượng. Mặt khác, người dùng muốn có một **interface** tập trung vào các nhu cầu cụ thể của họ. Điều này có thể gây ra vấn đề ở ranh giới hệ thống của chúng ta.

Hãy xem **java.util.Map** làm ví dụ. Như bạn có thể thấy khi xem Hình 8-1, **map** có một **interface** rất lớn với nhiều chức năng. Chắc chắn sức mạnh và sự linh hoạt này là hữu ích, nhưng nó cũng có thể là một nguy hiểm tiềm ẩn. Ví dụ: ứng dụng của chúng tôi có thể xây dựng **map** và chuyển nó đi khắp nơi. Ý định của chúng tôi là không ai trong số những người nhận **map** xóa bất kỳ thứ gì trong **map**. Nhưng ngay ở đầu danh sách là phương thức **clear()**. Bất kỳ người nào sử dụng **map** cũng có quyền xóa nó. Hoặc có thể quy ước thiết kế của chúng tôi là chỉ các loại đối tượng cụ thể mới có thể được lưu trữ trong **map**, nhưng **map** không ràng buộc một cách đáng tin cậy các loại đối tượng được đặt trong chúng. Bất kỳ người dùng nào được xác định đều có thể thêm các mục thuộc bất kỳ loại nào vào bất kỳ **map** nào.
**Hình 8-1**
**Các phương pháp của map**
* clear() void – Map
* containsKey(Object key) boolean – Map
* containsValue(Object value) boolean – Map • entrySet() Set – Map
* equals(Object o) boolean – Map
* get(Object key) Object – Map
* getClass() Class<? extends Object> – Object • hashCode() int – Map
* isEmpty() boolean – Map
* keySet() Set – Map
* notify() void – Object
* notifyAll() void – Object
* put(Object key, Object value) Object – Map • putAll(Map t) void – Map
* remove(Object key) Object – Map
* size() int – Map
* toString() String – Object
* values() Collection – Map
* wait() void – Object
* wait(long timeout) void – Object
* wait(long timeout, int nanos) void – Object

Nếu ứng dụng của chúng ta cần **Map** of **Sensors**, bạn có thể tìm thấy các cảm biến được thiết lập như sau:
```java
  Map sensors = new HashMap();
```
Sau đó, khi một số phần khác của mã cần truy cập vào cảm biến, bạn sẽ thấy mã này:
```java
  Sensor s = (Sensor) sensors.get(sensorId );
```
Chúng tôi không chỉ nhìn thấy nó một lần mà nhiều lần xuyên suốt mã. Ứng dụng khách của mã này có trách nhiệm lấy một **Object** từ  **Map** và truyền nó đến đúng loại. Điều này hoạt động, nhưng nó không phải là mã sạch. Ngoài ra, mã này không kể câu chuyện của nó tốt như nó có thể. Khả năng đọc của mã này có thể được cải thiện đáng kể bằng cách sử dụng **generic**, như được hiển thị bên dưới:
```java
  Map<Sensor> sensors = new HashMap<Sensor>(); 
  ...
  Sensor s = sensors.get(sensorId );
```
Tuy nhiên, điều này không giải quyết được vấn đề mà **Map\<Sensor>** cung cấp nhiều khả năng hơn chúng ta cần hoặc muốn.

Thay đổi một cách tự do phiên bản của **Map\<Sensor>** xung quanh hệ thống có nghĩa là sẽ có rất nhiều chỗ cần sửa nếu **interface** của **Map** thay đổi. Bạn có thể nghĩ rằng một sự thay đổi như vậy là khó xảy ra, nhưng hãy nhớ rằng nó đã thay đổi khi hỗ trợ **generic** được thêm vào trong **Java 5**. Thật vậy, chúng tôi đã thấy các hệ thống bị hạn chế sử dụng **generics** vì mức độ lớn của những thay đổi cần thiết để bù đắp tự do sử dụng **map**s.

Cách tốt hơn để sử dụng **Map** có thể giống như sau. Không người sử dụng **Sensors** nào sẽ quan tâm đến việc liệu **generics** có được sử dụng hay không. Sự lựa chọn đó đã trở thành (và luôn luôn nên) một chi tiết thực hiện.
```java
public class Sensors {
  private Map sensors = new HashMap();
  public Sensor getById(String id) { 
    return (Sensor) sensors.get(id);
  }
  //snip 
}

```
Giao diện ở ranh giới (**Map**) bị ẩn. Nó có thể phát triển với rất ít tác động đến phần còn lại của ứng dụng. Việc sử dụng **generic** không còn là vấn đề lớn nữa vì quá trình truyền và quản lý kiểu được xử lý bên trong lớp **Sensors**.

Giao diện này cũng được điều chỉnh và hạn chế để đáp ứng nhu cầu của ứng dụng. Nó dẫn đến mã dễ hiểu hơn và khó bị lạm dụng hơn. Lớp **Sensors** có thể thực thi các quy tắc thiết kế và nghiệp vụ.

Chúng tôi không đề xuất rằng mọi việc sử dụng **Map** được gói gọn trong hình thức này. Thay vào đó, chúng tôi khuyên bạn không nên vượt qua **Map** (hoặc bất kỳ giao diện nào khác ở ranh giới) xung quanh hệ thống của bạn. Nếu bạn sử dụng interface ranh giới như **Map**, hãy giữ nó bên trong lớp hoặc đóng họ các lớp, nơi nó được sử dụng. Tránh trả về hoặc chấp nhận nó như một đối số cho các API công khai.
