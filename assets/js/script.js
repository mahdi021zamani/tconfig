$(document).on('click', '#get', function(e) {
    e.preventDefault();
    let type = $('#type').val();
    let total = $('#total').val();
    let limit = $('#limit').val();
    let normal = document.getElementById('normal').checked;
    document.getElementById('get').disabled = true;
    $('#get').html('درحال دریافت ...');
    $('#result').addClass('none');
    $('#result textarea').html('');
    $('#customers').addClass('none');
    $('#result #qrCode').addClass('none');
    $('#slider').html('');
    let config = "";
    let channel = {};
    if ( normal ) {
        if ( type === 'warp' ) {
            config += "warp://auto/?ifp=10-20&ifps=10-20&ifpd=1-2&ifpm=m4#WarpInWarp ⭐️&&detour=warp://auto#Warp 🇮🇷";
            $('#result').removeClass('none');
            $('#get').html('دریافت کانفیگ');
            document.getElementById('get').disabled = false;
            $('#result textarea').html(config);
            return false;
        }
        let i = 0;
        jQuery.get('https://raw.githubusercontent.com/'+source+'/main/splitted/mixed?v1.'+Date.now(), function(data) {
            data = atob(data);
            data = JSON.parse(data);
            console.log(data);
            jQuery.each(data, function(index, item) {
                channel[item.channel.username] = {
                    title: item.channel.title,
                    username: item.channel.username,
                    logo: item.channel.logo,
                };
                if ( type !== 'mix' ) {
                    if ( type !== item.type ) {
                        return;
                    }
                }
                if ( total !== 'all' ) {
                    if ( total <= i ) {
                        return false;
                    }
                }
                if ( i !== 0 ) {
                    config += "\n";
                }
                config += item.config;
                i++;
            });
            document.getElementById('get').disabled = false;
            $('#get').html('دریافت کانفیگ');
            if ( config !== '' ) {
                $('#result').removeClass('none');
                $('#result textarea').html(config);
                generateCarousel(channel);
                $('#customers').removeClass('none');
            }
        })
        .fail(function() {
            document.getElementById('get').disabled = false;
            $('#get').html('دریافت کانفیگ');
            $('#result').addClass('none');
            $('#result textarea').html('');
            $('#customers').addClass('none');
            $('#slider').html('');
        });
    }
    else {
        document.getElementById('get').disabled = false;
        $('#get').html('دریافت کانفیگ');
        
        // تنظیم config برای نوع warp
        if ( type === "warp" ) {
            config = 'https://mahdi-ircf-ww.mahdi021zamani.workers.dev/';
        }
        // تنظیم config برای پروتکل های دیگر
        else if ( type === "shakhsi2" ) {
            config = 'https://vfarid2-3.mahdi021zamani.workers.dev/sub#mahdizamani(sub2)';
        }
        else if ( type === "mix" ) {
            config = 'https://raw.githubusercontent.com/'+source+'/main/splitted/mixed';
        }
        else if ( type === "ipv4" ) {
            config = 'https://raw.githubusercontent.com/'+source+'/main/layers/ipv4';
        }
        else if ( type === "ipv6" ) {
            config = 'https://raw.githubusercontent.com/'+source+'/main/layers/ipv6';
        }
        else if ( type === "shakhsi1" ) {
            config = 'https://latespeed.fojabiy603.workers.dev/sub/#mahdizamani(sub1)';
        }
        else if ( type === "p.s" ) {
            config = 'https://odd-unit-c94a.mahdi021zamani.workers.dev/';
        }
        else {
            // در صورتی که هیچکدام از پروتکل ها نباشد، URL عمومی با توجه به نوع انتخاب شده
            config = 'https://raw.githubusercontent.com/'+source+'/main/protocols/'+type;
        }
        
        $('#qrcode img').attr('src', "https://quickchart.io/qr/?size=300x200&light=ffffff&text="+encodeURIComponent(config));
        $('#qrModal h4').html('QRCode ('+type+')');
        $('#qrcode input').val(config);
        $("#qrModal").modal('show');
    }
});