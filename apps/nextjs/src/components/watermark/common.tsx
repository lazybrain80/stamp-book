const toDataURL = (url: string) => {
    return fetch(url)
    .then((response) => {
        return response.blob()
    })
    .then((blob) => {
        return URL.createObjectURL(blob)
    })
}

const extractFilename = (url: string) => {
    const filename = url.split('/').pop()
    return filename
}

export const ImageDownload = async (imageUrl: string) => {
    const link = document.createElement('a')
    link.href = await toDataURL(imageUrl)
    link.download = extractFilename(imageUrl) || ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}