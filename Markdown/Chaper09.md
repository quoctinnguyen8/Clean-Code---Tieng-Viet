# Kiểm tra đơn vị
![Image tilte_1](../image/chap09_image01.png)
Nghề của chúng ta đã đi một chặng đường dài trong mười năm qua. Năm 1997, không ai nghe nói về **Phát triển theo hướng kiểm tra**. Đối với đại đa số nhà phát triển, các bài kiểm tra đơn vị là những đoạn mã ngắn được viết để đảm bảo chương trình “hoạt động”. Chúng tôi sẽ cẩn thận viết các lớp và phương thức của mình rồi sau đó tạo ra một số mã đặc biệt để kiểm tra chúng. Thông thường, điều này sẽ liên quan đến một số loại chương trình điều khiển đơn giản cho phép tương tác thủ công với chương trình đã viết.  

Tôi nhớ mình đã viết một chương trình C++ cho một hệ thống nhúng thời gian thực vào giữa những năm 90. Chương trình là một bộ đếm thời gian đơn giản với chữ ký sau:
```C++
    void Timer::ScheduleCommand(Command* theCommand, int milliseconds)
```
Ý tưởng rất đơn giản; phương thức **thực thi** của **Command** sẽ được thực thi trong một luồng mới sau số mili giây được chỉ định. Vấn đề là, làm thế nào để kiểm tra nó.
Tôi đã viết một chương trình đơn giản để lắng nghe bàn phím. Mỗi khi một ký tự được nhập, nó sẽ lên lịch một lệnh sẽ nhập ký tự đó vào năm giây sau. Rồi tôi gõ một giai điệu nhịp nhàng trên bàn phím và đợi nó xuất hiện trên màn hình sau năm giây.
>“I . . . want-a-girl . . . just . . . like-the-girl-who-marr . . . ied . . . dear . . . old . . . dad.”   

Tôi thực sự đã hát giai điệu đó khi gõ dấu “.” và sau đó tôi hát lại khi các dấu chấm xuất hiện trên màn hình.

Đó là thử nghiệm của tôi! Khi tôi thấy nó hoạt động và chứng minh nó cho các đồng nghiệp của mình, tôi đã xoá mã thử nghiệm đi.

Như tôi đã nói, nghề của chúng ta đã trải qua một chặng đường dài. Ngày nay, tôi sẽ viết một bài kiểm tra để đảm bảo rằng mọi ngóc ngách của đoạn mã đó đều hoạt động như tôi mong đợi. Tôi sẽ tách mã của mình khỏi hệ điều hành thay vì chỉ gọi các hàm định thời gian tiêu chuẩn. Tôi sẽ mô phỏng các chức năng thời gian đó để tôi kiểm soát tuyệt đối thời gian. Tôi sẽ lên lịch các lệnh đặt cờ boolean, và sau đó tôi sẽ thay đổi thời gian đến tương lai, xem các cờ đó và đảm bảo rằng chúng chuyển từ sai thành đúng khi tôi thay đổi thời gian thành giá trị phù hợp.

Khi tôi có một bài kiểm tra để vượt qua, tôi sẽ đảm bảo rằng những bài kiểm tra đó thuận tiện để chạy cho bất kỳ ai khác cần làm việc với mã. Tôi sẽ đảm bảo rằng các bài kiểm tra và mã đã được kiểm tra cùng nhau vào cùng một gói nguồn.

Vâng, chúng ta đã đi một chặng đường dài; nhưng chúng ta phải đi xa hơn. Các động thái Agile và TDD đã khuyến khích nhiều lập trình viên viết các bài kiểm tra đơn vị tự động và nhiều hơn nữa đang gia nhập hàng ngũ này mỗi ngày. Nhưng trong cơn sốt điên cuồng muốn thêm kiểm tra vào kỷ luật của chúng tôi, nhiều lập trình viên đã bỏ lỡ một số điểm tinh tế và quan trọng hơn của việc viết bài kiểm tra tốt.
## Ba định luật TDD
Bây giờ mọi người đều biết rằng TDD yêu cầu chúng ta viết các bài kiểm tra đơn vị trước, trước khi chúng ta viết mã sản xuất. Nhưng quy luật đó chỉ là phần nổi của tảng băng chìm. Hãy xem xét ba luật sau:
* **Luật thứ nhất:** Bạn không được viết mã sản xuất cho đến khi bạn viết một bài kiểm tra đơn vị không đạt.
* **Luật thứ hai:** Bạn không được viết nhiều bài kiểm tra đơn vị hơn mức đủ để không đạt, và không biên dịch sẽ không thành công.
* **Luật thứ ba:** Bạn không được viết nhiều mã sản xuất hơn mức đủ để vượt qua bài kiểm tra hiện đang không đạt.

Ba luật này ép bạn vào một chu trình có lẽ dài ba mươi giây. Các bài kiểm tra và mã sản xuất được viết cùng nhau, với việc các bài kiểm tra viết trước mã sản xuất vài giây.

Nếu chúng ta làm việc theo cách này, chúng ta sẽ viết hàng chục bài kiểm tra mỗi ngày, hàng trăm bài kiểm tra mỗi tháng và hàng nghìn bài kiểm tra mỗi năm. Nếu chúng tôi làm việc theo cách này, những bài kiểm tra đó sẽ bao gồm hầu như tất cả các mã sản xuất của chúng tôi. Phần lớn các thử nghiệm đó, có thể sánh ngang với kích thước của chính mã sản xuất, có thể đưa ra một vấn đề khó khăn cho quản lý .
## Giữ sạch các bài kiểm tra


