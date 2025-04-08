// Script to handle protocol configuration selection, copying, and display

$(document).on('click', '#normal, #sub', function(e) { let normal = document.getElementById('normal').checked; if ( normal ) { $('#total').val('25').removeClass('none'); $('#limit').addClass('none'); } else { $('#total').val('all').addClass('none'); $('#limit').removeClass('none'); } });

$(document).on('click', '#copy', function(e) { let isNormal = document.getElementById('normal').checked; let text; if (isNormal) { text = $('#result textarea').val(); } else { text = $('#subUrl').val(); } navigator.clipboard.writeText(text).then(() => { $('#copy').text('کپی شد!'); setTimeout(function() { $('#copy').text('کپی کانفیگ'); }, 2500); }).catch(() => { alert('خطا در کپی کردن'); }); });

$(document).on('change', '#type, #total, #limit', function(e) { e.preventDefault(); $('#get').trigger('click'); });

let source = 'soroushmirzaei/telegram-configs-collector'; $(document).on('click', '#get', function(e) { e.preventDefault(); let type = $('#type').val(); let total = $('#total').val(); let limit = $('#limit').val(); let normal = document.getElementById('normal').checked; document.getElementById('get').disabled = true; $('#get').html('درحال دریافت ...'); $('#result').addClass('none'); $('#result textarea').html(''); $('#customers').addClass('none'); $('#result #qrCode').addClass('none'); $('#slider').html(''); let config = ""; let channel = {};

if ( normal ) {
    if ( type === 'warp' ) {
        config += "warp://auto/?ifp=10-20&ifps=10-20&ifpd=1-2&ifpm=m4#WarpInWarp ⭐️&&detour=warp://auto#Warp 🇮🇷";
        $('#result').removeClass('none');
        $('#get').html('دریافت کانفیگ');
        document.getElementById('get').disabled = false;
        $('#result textarea').val(config);
        return false;
    }

    let i = 0;
    jQuery.get('https://raw.githubusercontent.com/' + source + '/main/splitted/mixed?v1.' + Date.now(), function(data) {
        data = atob(data);
        data = JSON.parse(data);
        jQuery.each(data, function(index, item) {
            channel[item.channel.username] = {
                title: item.channel.title,
                username: item.channel.username,
                logo: item.channel.logo,
            };
            if (type !== 'mix' && type !== item.type) return;
            if (total !== 'all' && total <= i) return false;
            if (i !== 0) config += "\n";
            config += item.config;
            i++;
        });
        document.getElementById('get').disabled = false;
        $('#get').html('دریافت کانفیگ');
        if (config !== '') {
            $('#result').removeClass('none');
            $('#result textarea').val(config);
            generateCarousel(channel);
            $('#customers').removeClass('none');
        }
    }).fail(function() {
        document.getElementById('get').disabled = false;
        $('#get').html('دریافت کانفیگ');
        $('#result').addClass('none');
        $('#result textarea').html('');
        $('#customers').addClass('none');
        $('#slider').html('');
    });
} else {
    document.getElementById('get').disabled = false;
    $('#get').html('دریافت کانفیگ');

    if (type === "warp") {
        config = 'https://mahdi-ircf-ww.mahdi021zamani.workers.dev/';
    } else if (type === "shakhsi2") {
        config = 'https://vfarid2-3.mahdi021zamani.workers.dev/sub#mahdizamani(sub2)';
    } else if (type === "mix") {
        config = 'https://raw.githubusercontent.com/' + source + '/main/splitted/mixed';
    } else if (type === "ipv4") {
        config = 'https://raw.githubusercontent.com/' + source + '/main/layers/ipv4';
    } else if (type === "ipv6") {
        config = 'https://raw.githubusercontent.com/' + source + '/main/layers/ipv6';
    } else if (type === "shakhsi1") {
        config = 'https://latespeed.fojabiy603.workers.dev/sub/#mahdizamani(sub1)';
    } else if (type === "p.s") {
        config = 'https://odd-unit-c94a.mahdi021zamani.workers.dev/';
    } else {
        config = 'https://raw.githubusercontent.com/' + source + '/main/protocols/' + type;
    }

    $('#result textarea').val('');
    $('#result').removeClass('none');
    $('#qrcode img').attr('src', "https://quickchart.io/qr/?size=300x200&light=ffffff&text=" + encodeURIComponent(config));
    $('#qrModal h4').html('QRCode (' + type + ')');
    $('#qrcode input').val(config);
    $("#qrModal").modal('show');
    $('#copy').show();
}
});
$(document).on('click', '#copyFromQR, #copyUrl', function (e) { e.preventDefault(); const input = document.getElementById('subUrl'); input.select(); input.setSelectionRange(0, 99999); document.execCommand('copy'); $("#qrModal").modal('hide'); alert('آدرس در کلیپ‌بورد کپی شد.'); });

function generateCarousel(channel) { let carousel = ""; jQuery.each(channel, function(index, item) { if (typeof item !== "undefined" && (item.title !== null || item.logo !== null)) { carousel += '<a href="https://t.me/' + item.username + '" title="' + item.title + '" target="_blank">'; carousel += '<div class="slide">'; carousel += '<img src="' + item.logo + '">'; carousel += '<p dir="auto">' + item.title + '</p>'; carousel += '</div>'; carousel += '</a>'; } }); $('#slider').html(carousel).slick('refresh'); }

window.addEventListener('load', function() { $('#slider').slick({ slidesToShow: 6, slidesToScroll: 1, autoplay: true, autoplaySpeed: 1500, arrows: false, dots: false, pauseOnHover: true, responsive: [{ breakpoint: 768, settings: { slidesToShow: 5 } }, { breakpoint: 520, settings: { slidesToShow: 3 } }] }); });

