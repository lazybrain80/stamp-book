// base build
docker build -t stamp-book:1.0 .

// arm64 build
docker buildx create --name stampArm64Builder --use

docker buildx build --platform linux/arm64 -t ghcr.io/lazybrain80/stamp-book:1.0 --push .