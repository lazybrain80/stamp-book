docker run -dit -p 4444:4444 --name stamp-book ghcr.io/lazybrain80/stamp-book:1.0

//집
docker run -itd --name stamp-book-sh\
    --restart always\
    --net host\
    stamp-book:tmp /bin/sh