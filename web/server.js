var listFile = [
	{
		title: "Chương 1: CODE SẠCH",
		link: '/Markdown/Chaper01.md'
	},
	{
		title: "Chương 2: NHỮNG CÁI TÊN RÕ NGHĨA",
		link: '/Markdown/Chaper02.md'
	},
	{
		title: "Chương 3: HÀM",
		link: '/Markdown/Chaper03.md'
	},
	{
		title: "Chương 4: COMMENT",
		link: '/Markdown/Chaper04.md'
	},
	{
		title: "Chương 5: ĐỊNH DẠNG CODE",
		link: '/Markdown/Chaper05.md'
	},
	{
		title: "Chương 6: ĐỐI TƯỢNG VÀ CẤU TRÚC DỮ LIỆU",
		link: '/Markdown/Chaper06.md'
	},
	{
		title: "Chương 7: XỬ LÝ LỖI",
		link: '/Markdown/Chaper07.md'
	},
	{
		title: "Chương 8: RANH GIỚI",
		link: '/Markdown/Chaper08.md'
	}, {
		title: "Chương 9: KIỂM TRA ĐƠN VỊ",
		link: '/Markdown/Chaper09.md'
	},
	{
		title: "Chương 10: LỚP",
		link: '/Markdown/Chaper10.md'
	},
	{
		title: "Chương 11: HỆ THỐNG",
		link: '/Markdown/Chaper11_System.md'
	}
];
$(document).ready(function () {
	const getNumber = (number) => {
		return number < 10 ? '0' + number : number;
	}

	const urlParams = new URLSearchParams(window.location.search);
	// list folder in select - option
	listFile.forEach(function (file, index) {
		var isSelected = urlParams.get('chapter') == index + 1;
		var chapterTemplate = `<option ${isSelected ? 'selected' : ''} value="/index.html?chapter=${getNumber(index + 1)}">${file.title}</option>`;
		$('.pagination select').append(chapterTemplate);
	});
	let chapter = urlParams.get('chapter');
	if ((chapter > listFile.length || chapter === null || chapter < 1)) {
		window.location.href = '/index.html?chapter=01';
	}	
	$("#info_chapter option")
	var urlChapter = listFile[parseInt(chapter - 1)].link;
	document.title = listFile[parseInt(chapter - 1)].title;
	$.ajax({
		url: urlChapter,
		type: 'GET',
		success: function (response) {
			$('#content-markdown').html(marked.parse(response));
			// Khôi phục vị trí scroll đã lưu cho chương này
			var savedScroll = localStorage.getItem('scrollPos_' + chapter);
			if (savedScroll) window.scrollTo(0, parseInt(savedScroll));
		},
		error: function (xhr, status, error) {
			$('#content-markdown').html('<p class="text-danger text-center py-5">Không tải được nội dung. Vui lòng thử lại.</p>');
			console.error('Lỗi khi gửi yêu cầu:', error);
		}
	});
	// Lưu vị trí scroll trước khi rời trang
	window.addEventListener('beforeunload', function () {
		localStorage.setItem('scrollPos_' + chapter, window.scrollY);
	});
	$('.next').on('click', function (ev) {
		chapter = parseInt(chapter);
		if (chapter === 1 && chapter === listFile.length) {
			$("#btn-previ").css("display", "none");
			return;
		}
		const dataChapter = $(ev.currentTarget).attr('data-btn');
		if (dataChapter === 'next') {
			chapter++;
		} else {
			chapter--;
		}
		window.location.href = `/index.html?chapter=${getNumber(parseInt(chapter))}`;
	});


	chapter = parseInt(chapter);
	if (parseInt(chapter) === 1) {
		$("#btn-previ").css("display", "none");
	}
	if (parseInt(chapter) !== 1) {
		$("#btn-previ").css("display", "inline-block");

	}
	if (parseInt(chapter) === listFile.length) {
		$("#btn-next").css("display", "none");

	}
	if (parseInt(chapter) !== listFile.length) {
		$("#btn-next").css("display", " inline-block");
	}
});

