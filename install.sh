wget -O /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-4.3.1-amd64-static.tar.xz
if [ ! -d /opt/ffmpeg ] ; then mkdir -p /opt/ffmpeg; fi
tar xvf /tmp/ffmpeg.tar.xz -C /opt/ffmpeg
if [[ ! -f /usr/bin/ffmpeg ]] ; then ln -sf /opt/ffmpeg/ffmpeg-4.3.1-amd64-static/ffmpeg /usr/bin/ffmpeg; fi
if [[ ! -f /usr/bin/ffprobe ]] ; then ln -sf /opt/ffmpeg/ffmpeg-4.3.1-amd64-static/ffprobe /usr/bin/ffprobe; fi
if [ `pecl list | grep imagick` ] ; then pecl install -f imagick; fi