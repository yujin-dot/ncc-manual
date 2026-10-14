// Google Analytics 4
// GA_ID에 GA4 측정 ID(G-로 시작)를 넣으면 한국어판 · 영어판 모두 수집됩니다. 비어 있으면 아무것도 보내지 않습니다.
(function(){
  var GA_ID = '';
  if (!/^G-[A-Z0-9]+$/.test(GA_ID)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date());
  // content_language: 문서 언어(ko / en). 브라우저 언어(language)와 구분됩니다.
  gtag('config', GA_ID, { content_language: document.documentElement.lang });
})();
