$(document).on('click', '#normal, #sub', function(e) {
    let normal = document.getElementById('normal').checked;
    if (normal) {
        $('#total').val('25').removeClass('none');
        $('#limit').addClass('none');
    } else {
        $('#total').val('all').addClass('none');
        $('#limit').removeClass('none');
    }
});

$(document).on('click', '#copy', function(e) {
    let text = $('#result textarea').val();
    navigator.clipboard.writeText(text).then(() => {
        $('#copy').text('کپی شد!');
        setTimeout(function() {
            $('#copy').text('کپی کانفیگ');
        }, 2500);
    }).catch(() => {});
});

$(document).on('change', '#type, #total, #limit', function(e) {
    e.preventDefault();
    $('#get').trigger('click');
});

let source = 'soroushmirzaei/telegram-configs-collector';

$(document).on('click', '#get', function(e) {
    e.preventDefault();
    let type = $('#type').val();
    let total = $('#total').val();
    let limit = $('#limit').val();
    let normal = document.getElementById('normal').checked;

    $('#get').prop('disabled', true).html('درحال دریافت ...');
    $('#result').addClass('none');
    $('#result textarea').val('');
    $('#customers').addClass('none');
    $('#result #qrCode').addClass('none');
    $('#slider').html('');

    let config = "";
    let channel = {};

    if (normal) {
        if (type === 'warp') {
            config = "warp://auto/?ifp=10-20&ifps=10-20&ifpd=1-2&ifpm=m4#WarpInWarp ⭐️&&detour=warp://auto#Warp 🇮🇷";
            $('#result').removeClass('none');
            $('#result textarea').val(config);
            $('#get').prop('disabled', false).html('دریافت کانفیگ');
            return;
        }

        $.get('https://raw.githubusercontent.com/' + source + '/main/splitted/mixed?v1.' + Date.now())
            .done(function(data) {
                try {
                    data = atob(data);
                    data = JSON.parse(data);
                    let i = 0;
                    $.each(data, function(index, item) {
                        channel[item.channel.username] = {
                            title: item.channel.title,
                            username: item.channel.username,
                            logo: item.channel.logo
                        };

                        if (type !== 'mix' && item.type !== type) return;

                        if (total !== 'all' && i >= total) return false;

                        config += (i !== 0 ? "\n" : "") + item.config;
                        i++;
                    });

                    if (config !== '') {
                        $('#result').removeClass('none');
                        $('#result textarea').val(config);
                        generateCarousel(channel);
                        $('#customers').removeClass('none');
                    }
                } catch (err) {
                    console.error("Parsing error:", err);
                }
            })
            .fail(function() {
                alert("خطا در دریافت اطلاعات");
            })
            .always(function() {
                $('#get').prop('disabled', false).html('دریافت کانفیگ');
            });

    } else {
        // sub mode
        switch (type) {
            case "warp":
                config = 'https://mahdi-ircf-ww.mahdi021zamani.workers.dev/';
                break;
            case "shakhsi2":
                config = 'https://vfarid2-3.mahdi021zamani.workers.dev/sub#mahdizamani(sub2)';
                break;
            case "mix":
                config = 'https://raw.githubusercontent.com/' + source + '/main/splitted/mixed';
                break;
            case "ipv4":
                config = 'https://raw.githubusercontent.com/' + source + '/main/layers/ipv4';
                break;
            case "ipv6":
                config = 'https://raw.githubusercontent.com/' + source + '/main/layers/ipv6';
                break;
            case "shakhsi1":
                config = 'https://latespeed.fojabiy603.workers.dev/sub/#mahdizamani(sub1)';
                break;
            case "p.s":
                config = 'https://odd-unit-c94a.mahdi021zamani.workers.dev/';
                break;
            default:
                config = 'https://raw.githubusercontent.com/' + source + '/main/protocols/' + type;
                break;
        }

        $('#qrcode img').attr('src', "https://quickchart.io/qr/?size=300x200&light=ffffff&text=" + encodeURIComponent(config));
        $('#qrModal h4').html('QRCode (' + type + ')');
        $('#qrcode input').val(config);
        $('#result textarea').val(config);
        $('#result').removeClass('none');
        $('#get').prop('disabled', false).html('دریافت کانفیگ');
        $("#qrModal").modal('show');
    }
});

$(document).on('click', '#copyFromQR, #copyUrl', function(e) {
    e.preventDefault();
    const input = document.getElementById('subUrl');
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    $("#qrModal").modal('hide');
    alert('آدرس در کلیپ‌بورد کپی شد.');
});

function generateCarousel(channel) {
    let carousel = "";
    $.each(channel, function(index, item) {
        if (item && (item.title || item.logo)) {
            carousel += `<a href="https://t.me/${item.username}" title="${item.title}" target="_blank">
                            <div class="slide">
                                <img src="${item.logo}">
                                <p dir="auto">${item.title}</p>
                            </div>
                        </a>`;
        }
    });
    $('#slider').html(carousel).slick('refresh');
}

window.addEventListener('load', function() {
    $('#slider').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        dots: false,
        pauseOnHover: true,
        responsive: [{
            breakpoint: 768,
            settings: { slidesToShow: 5 }
        }, {
            breakpoint: 520,
            settings: { slidesToShow: 3 }
        }]
    });
});