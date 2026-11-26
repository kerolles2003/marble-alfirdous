/* معرض الفردوس — كود مشترك لكل الصفحات */
/* فيديوهات يوتيوب — حط لينك الفيديو كامل بين علامتين تنصيص في القايمة دي،
   مثال: "https://www.youtube.com/watch?v=XXXXXXXXXXX" */
var YOUTUBE_VIDEOS = [
  // "https://www.youtube.com/watch?v=XXXXXXXXXXX",
];
function ytId(url){
  var m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}
(function(){
  var box = document.getElementById('videosBox');
  if(!box) return;
  if(YOUTUBE_VIDEOS.length === 0){
    box.innerHTML =
      '<div class="col-md-6"><div class="video-ph"><div class="play">▶</div><b>فيديو قريباً</b><span>فيديوهات الشغل هتظهر هنا أول ما تترفع على يوتيوب</span></div></div>' +
      '<div class="col-md-6"><div class="video-ph"><div class="play">▶</div><b>فيديو قريباً</b><span>ابعت لينك اليوتيوب وهيتحط هنا على طول</span></div></div>';
  } else {
    YOUTUBE_VIDEOS.forEach(function(u){
      var id = ytId(u); if(!id) return;
      var d = document.createElement('div');
      d.className = 'col-md-6';
      d.innerHTML = '<div class="video"><iframe src="https://www.youtube.com/embed/' + id + '" title="فيديو من شغل معرض الفردوس" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
      box.appendChild(d);
    });
  }
})();

/* فورم التواصل يبعت على واتساب */
var contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    var name = (document.getElementById('fName').value + ' ' + document.getElementById('fLast').value).trim();
    var phone = document.getElementById('fPhone').value.trim();
    var need = document.getElementById('fNeed').value.trim();
    var msg = document.getElementById('fMsg').value.trim();
    var text = 'السلام عليكم، أنا ' + name + '\nرقم التليفون: ' + phone + '\nعايز أنفذ: ' + need + '\n' + msg;
    window.open('https://wa.me/201121466648?text=' + encodeURIComponent(text), '_blank');
  });
}

/* فلترة المعرض */
var filterItem = document.querySelector(".items");
var filterImg = document.querySelectorAll(".gallery .image");
if(filterItem){
  filterItem.addEventListener('keydown', function(e){
    if((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('item')){
      e.preventDefault(); e.target.click();
    }
  });
  filterItem.addEventListener('click', function(selectedItem){
    if(selectedItem.target.classList.contains("item")){
      filterItem.querySelector(".active").classList.remove("active");
      selectedItem.target.classList.add("active");
      var filterName = selectedItem.target.getAttribute("data-name");
      filterImg.forEach(function(image){
        var filterImges = image.getAttribute("data-name");
        if((filterImges == filterName) || (filterName == "all")){
          image.classList.remove("hide");
          image.classList.add("show");
        }else{
          image.classList.add("hide");
          image.classList.remove("show");
        }
      });
    }
  });
}
