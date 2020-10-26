# Lớp
## bởi Jeff Langr
![Image tilte_1](../image/chap10_image01.png)
Cho đến nay trong cuốn sách này, chúng ta đã tập trung vào cách viết tốt các dòng và khối mã. Đi sâu vào thành phần thích hợp của các chức năng và cách chúng tương tác với nhau. Nhưng sau tất cả, sự chú ý đến tính biểu đạt của các câu lệnh và các chức năng mà chúng bao gồm, vẫn chưa có mã sạch cho đến khi quan tâm đến các cấp tổ chức mã cao hơn. Hãy nói về các mã lớp sạch.
## Tổ chức lớp
Theo quy ước Java tiêu chuẩn, một lớp phải bắt đầu bằng một danh sách các biến. Các **public static constants**, nếu có, nên xuất hiện trước. Sau đó là các biến **private static**, tiếp theo là các biến **private**. Ít khi có lý do chính đáng để có một biến là **public**.  

Các hàm **public** nên tuân theo danh sách các biến. Chúng tôi muốn đặt các tiện ích **private** được gọi bởi một chức năng **public** ngay sau chức năng đó. Điều này tuân theo quy tắc nhìn xuống và giúp chương trình đọc giống như một văn.
## Đóng gói
Chúng ta muốn giữ các biến và hàm của mình ở chế độ riêng tư, nhưng không nên quá cứng nhắc về nó. Đôi khi cần một biến hoặc một hàm **protected** để có thể sử dụng kiểm tra. Quy tắc kiểm tra nên được ưu tiên. Nếu một thử nghiệm trong cùng một gói cần gọi một hàm hoặc truy cập một biến, chúng tôi sẽ đặt nó là **protected** hoặc đặt nó trong phạm vi gói. Tuy nhiên, trước tiên, chúng ta sẽ tìm cách duy trì quyền riêng tư. Nới lỏng sự đóng gói luôn là phương sách cuối cùng.
## Lớp nên nhỏ!  
Quy tắc đầu tiên của các lớp là chúng phải nhỏ. Quy tắc thứ hai của các lớp là chúng phải nhỏ hơn thế. Đúng vậy, tôi lặp lại từ ngữ chính xác từ chương **Hàm**. Cũng như các hàm, nhỏ hơn là quy tắc chính khi thiết kế các lớp. Đối với các chức năng, câu hỏi trước mắt luôn là **"Nhỏ như thế nào?"**

Với các chức năng, chúng ta đo kích thước bằng cách đếm số dòng. Với các lớp, chúng tôi sử dụng một thước đo khác. Chúng ta tính đến trách nhiệm.

Listing kê 10-1 phác thảo một lớp, **SuperDashboard**, hiển thị khoảng 70 phương thức **public**. Hầu hết các nhà phát triển sẽ đồng ý rằng nó có kích thước hơi quá lớn. Một số nhà phát triển có thể coi **SuperDashboard** là **“lớp học của Chúa”**.   
**Listing 10-1**  
**Quá nhiều trách nhiệm**  
```java
public class SuperDashboard extends JFrame implements MetaDataUser {
    public String getCustomizerLanguagePath();
    public void setSystemConfigPath(String systemConfigPath);
    public String getSystemConfigDocument();
    public void setSystemConfigDocument(String systemConfigDocument); 
    public boolean getGuruState();
    public boolean getNoviceState();
    public boolean getOpenSourceState();
    public void showObject(MetaObject object); 
    public void showProgress(String s);
    public boolean isMetadataDirty();
    public void setIsMetadataDirty(boolean isMetadataDirty);
    public Component getLastFocusedComponent();
    public void setLastFocused(Component lastFocused);
    public void setMouseSelectState(boolean isMouseSelected); 
    public boolean isMouseSelected();
    public LanguageManager getLanguageManager();
    public Project getProject();
    public Project getFirstProject();
    public Project getLastProject();
    public String getNewProjectName();
    public void setComponentSizes(Dimension dim);
    public String getCurrentDir();
    public void setCurrentDir(String newDir);
    public void updateStatus(int dotPos, int markPos);
    public Class[] getDataBaseClasses();
    public MetadataFeeder getMetadataFeeder();
    public void addProject(Project project);
    public boolean setCurrentProject(Project project);
    public boolean removeProject(Project project);
    public MetaProjectHeader getProgramMetadata();
    public void resetDashboard();
    public Project loadProject(String fileName, String projectName); 
    public void setCanSaveMetadata(boolean canSave);
    public MetaObject getSelectedObject();
    public void deselectObjects();
    public void setProject(Project project);
    public void editorAction(String actionName, ActionEvent event); 
    public void setMode(int mode);
    public FileManager getFileManager();
    public void setFileManager(FileManager fileManager);
    public ConfigManager getConfigManager();
    public void setConfigManager(ConfigManager configManager); 
    public ClassLoader getClassLoader();
    public void setClassLoader(ClassLoader classLoader);
    public Properties getProps();
    public String getUserHome();
    public String getBaseDir();
    public int getMajorVersionNumber();
    public int getMinorVersionNumber();
    public int getBuildNumber();
    public MetaObject pasting(
    MetaObject target, MetaObject pasted, MetaProject project); 
    public void processMenuItems(MetaObject metaObject);
    public void processMenuSeparators(MetaObject metaObject); 
    public void processTabPages(MetaObject metaObject);
    public void processPlacement(MetaObject object);
    public void processCreateLayout(MetaObject object);
    public void updateDisplayLayer(MetaObject object, int layerIndex); 
    public void propertyEditedRepaint(MetaObject object);
    public void processDeleteObject(MetaObject object);
    public boolean getAttachedToDesigner();
    public void processProjectChangedState(boolean hasProjectChanged); 
    public void processObjectNameChanged(MetaObject object);
    public void runProject();
    public void setAçowDragging(boolean allowDragging); 
    public boolean allowDragging();
    public boolean isCustomizing();
    public void setTitle(String title);
    public IdeMenuBar getIdeMenuBar();
    public void showHelper(MetaObject metaObject, String propertyName); 
    // ... many non-public methods follow ...
}
```
Nhưng nếu **SuperDashboard** chỉ chứa các phương thức được hiển thị trong Listing 10-2 thì sao?  
**Listing 10-2**   
**Đủ nhỏ?**  
```java
public class SuperDashboard extends JFrame implements MetaDataUser {
    public Component getLastFocusedComponent();
    public void setLastFocused(Component lastFocused);
    public int getMajorVersionNumber();
    public int getMinorVersionNumber();
    public int getBuildNumber(); 
}
```
Năm phương pháp không phải là quá nhiều, phải không? Trong trường hợp này, đó là bởi vì mặc dù có số lượng các phương pháp nhỏ, nhưng **SuperDashboard** lại có quá nhiều **trách nhiệm**.

Tên của một lớp phải mô tả những trách nhiệm mà nó thực hiện. Trên thực tế, đặt tên có lẽ là cách đầu tiên giúp xác định quy mô lớp. Nếu chúng ta không thể tìm ra một tên ngắn gọn cho một lớp, thì có thể nó quá lớn. Tên lớp càng mơ hồ thì càng có nhiều khả năng nó có quá nhiều trách nhiệm. Ví dụ: tên lớp bao gồm các từ như **Processor** hoặc **Manager** hoặc **Super** thường gợi ý về sự kết hợp của nhiều trách nhiệm.

Chúng ta cũng có thể viết mô tả ngắn gọn về lớp học trong khoảng 25 từ, không sử dụng các từ **“nếu”**, **“và”**, **“hoặc”** hoặc **“nhưng”**. Chúng ta sẽ mô tả **SuperDashboard** như thế nào? “**SuperDashboard** cung cấp quyền truy cập vào thành phần giữ tiêu điểm **và** nó cũng cho phép chúng tôi theo dõi phiên bản **cùng** số lượng bản dựng”. Chữ “và” đầu tiên là dấu hiệu rằng **SuperDashboard** có quá nhiều trách nhiệm.
## Nguyên tắc trách nhiệm duy nhất
Nguyên tắc Trách nhiệm Đơn lẻ (SRP) nêu rõ rằng một lớp hoặc mô-đun nên có một và **chỉ một lý do để thay đổi**. Nguyên tắc này cung cấp cho chúng ta cả định nghĩa về trách nhiệm và hướng dẫn về quy mô lớp học. Các lớp chỉ nên có một trách nhiệm — chỉ một lý do để thay đổi.

Lớp **SuperDashboard** có vẻ nhỏ trong Listing 10-2, nhưng có hai lý do để thay đổi. **Đầu tiên**, nó theo dõi thông tin về phiên bản dường như cần được cập nhật mỗi khi phần mềm được xuất xưởng. **Thứ hai**, nó quản lý các thành phần Java Swing (nó là một dẫn xuất của **JFrame**, đại diện Swing của một cửa sổ GUI cấp cao nhất). Không nghi ngờ gì nữa, chúng ta sẽ muốn cập nhật số phiên bản nếu chúng tôi thay đổi bất kỳ mã Swing nào, tuy nhiên có trường hợp khác đó là: Chúng ta có thể thay đổi thông tin phiên bản dựa trên những thay đổi với mã khác trong hệ thống.

Cố gắng xác định trách nhiệm (lý do để thay đổi) thường giúp chúng ta nhận ra và tạo ra những hàm tượng tốt hơn trong mã của mình. Chúng ta có thể dễ dàng trích xuất cả ba phương thức **SuperDashboard** xử lý thông tin phiên bản vào một lớp riêng biệt có tên **Version**. (Xem Listing 10-3.) Lớp **Version** là một cấu trúc có tiềm năng cao để sử dụng lại trong các ứng dụng khác!   
**Listing 10-3**  
**Một lớp trách nhiệm duy nhất**
```java
public class Version {
    public int getMajorVersionNumber(); 
    public int getMinorVersionNumber(); 
    public int getBuildNumber();
}
```
SRP là một trong những khái niệm quan trọng nhất trong thiết kế OO. Đây cũng là một trong những khái niệm đơn giản để hiểu và tuân thủ. Tuy nhiên, kỳ lạ là SRP thường là nguyên tắc thiết kế lớp bị  phạm nhiều nhất. Chúng tôi thường xuyên gặp phải các lớp làm quá nhiều thứ. Tại sao?

Làm cho phần mềm chạy và làm cho phần mềm sạch là hai việc khác nhau. Hầu hết chúng ta đều nghĩ ưu tiên phần mềm chạy được trước, vì vậy chúng ta tập trung vào việc làm cho mã của mình chạy đúng ngữ cảnh nhiều hơn là tính tổ chức và sự sạch sẽ. Điều này hoàn toàn phù hợp. Tuy nhiên duy trì sự tách biệt cũng quan trọng trong việc lập trình như việc chạy được các chương trình vậy.

Vấn đề là có quá nhiều người nghĩ rằng đã hoàn thành công việc khi chương trình chạy đúng. Chúng ta không để tâm đến việc tổ chức mã và sự sạch sẽ. Và ngay lập tức chuyển sang vấn đề tiếp theo thay vì xem lại và **chia nhỏ các lớp được nhét quá nhiều thành các lớp nhỏ hơn với một trách nhiệm duy nhất**.

Đồng thời, nhiều nhà phát triển lo ngại rằng một số lượng lớn các lớp nhỏ, khiến việc hiểu bức tranh lớn trở nên khó khăn hơn. Họ lo ngại rằng phải di chuyển từ lớp này sang lớp khác để tìm ra cách hoàn thành một phần công việc lớn hơn.

Tuy nhiên, việc di chuyển giữa các lớp của một hệ thống có nhiều lớp nhỏ không nhiều hơn hệ thống có một vài lớp lớn. Có nhiều thứ cần học trong hệ thống có một vài lớp học lớn. Vậy câu hỏi đặt ra là: Bạn có muốn các công cụ của mình được tổ chức thành các hộp công cụ với nhiều ngăn kéo nhỏ, mỗi ngăn chứa các thành phần được xác định rõ ràng và được dán nhãn rõ ràng? Hay bạn muốn có một vài ngăn kéo mà bạn chỉ việc ném mọi thứ vào?

Mỗi hệ thống lớn sẽ chứa một lượng lớn logic và độ phức tạp. Mục tiêu chính trong việc quản lý sự phức tạp đó là tổ chức nó để một nhà phát triển biết nơi cần tìm, để tìm mọi thứ và chỉ cần hiểu sự phức tạp bị ảnh hưởng trực tiếp tại bất kỳ thời điểm nào. Ngược lại, một hệ thống với các lớp đa dụng, nhiều chức năng luôn cản trở chúng ta bằng cách yêu cầu chúng ta để ý qua rất nhiều thứ mà chúng ta không cần biết ngay khi đó.

Nhắc lại các điểm  trọng: Chúng ta muốn hệ thống của mình bao gồm nhiều lớp nhỏ, không phải một vài lớp lớn. Mỗi lớp nhỏ chứa đựng **một** khả năng đáp ứng duy nhất, có một lý do duy nhất để thay đổi và cộng tác với một vài lớp khác để đạt được các hành vi hệ thống mong muốn.
## Sự gắn kết
Các lớp nên có một số lượng nhỏ các biến **instance**. Mỗi phương thức của một lớp nên thao tác với một hoặc nhiều biến đó. Nói chung, một phương thức càng thao tác nhiều biến thì phương thức đó càng gắn kết với lớp của nó. Một lớp trong đó mỗi biến được sử dụng bởi mỗi phương thức là tối đa gắn kết.

Nói chung, không nên và cũng không thể tạo các lớp gắn kết tối đa như vậy; mặt khác, chúng ta muốn sự gắn kết cao. Khi tính liên kết cao, có nghĩa là các phương thức và biến của lớp là đồng phụ thuộc và gắn kết với nhau như một tổng thể logic.

Xem xét việc triển khai một Stack trong Listing 10-4. Đây là một lớp rất gắn kết. Trong ba phương thức, chỉ có **size()** không sử dụng được cả hai biến.     
**Listing 10-4**  
**Stack.java A cohesive class.**  
```java
public class Stack {
    private int topOfStack = 0;
    List<Integer> elements = new LinkedList<Integer>();
    
    public int size() { 
        return topOfStack;
    }
    
    public void push(int element) { 
        topOfStack++; 
        elements.add(element);
    }
    
    public int pop() throws PoppedWhenEmpty { 
        if (topOfStack == 0)
            throw new PoppedWhenEmpty();
        int element = elements.get(--topOfStack); 
        elements.remove(topOfStack);
        return element;
    } 
}
```
Chiến lược giữ các hàm nhỏ và giữ cho danh sách tham số ngắn đôi khi có thể dẫn đến sự gia tăng của các biến **instance** được sử dụng bởi một tập hợp con các phương thức. Khi điều này xảy ra, hầu như luôn luôn có nghĩa là có ít nhất một lớp mang nhiệm vụ khác đang hình thành. Bạn nên cố gắng tách các biến và phương thức thành hai hoặc nhiều lớp để các lớp mới gắn kết hơn.
## Duy trì kết quả gắn kết trong nhiều lớp nhỏ




