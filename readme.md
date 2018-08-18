#DseeLab

Images must be encoded to MP4 file :
ffmpeg -loop 1 -i "./image-steeve.png" -c:v libx264 -vprofile baseline -level 3 -s 512x512 -r 24 -refs 1 -b:v 1.0M -c:a libmp3lame -pix_fmt yuvj420p -t 5 "./image-steeve.mp4"
