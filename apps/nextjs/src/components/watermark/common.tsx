import axios from 'axios';

const toDataURL = async (url: string) => {
    const response = await axios.get(url, { responseType: 'blob' })
    return URL.createObjectURL(response.data)
}

const extractFilename = (url: string) => {
    const filename = url.split('/').pop()
    return filename
}

const getFormatFromUrl = (url: string) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('format');
}

export const ImageDownload = async (imageUrl: string) => {
    const link = document.createElement('a')
    const download_url = await toDataURL(imageUrl)
    const fileName = `${extractFilename(download_url)}.${getFormatFromUrl(imageUrl)}`
    link.href = download_url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const formatDate = (lang:string, date: Date) => {
    if (lang === 'ko') {
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    }

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
};

export const WM_TEXT = "wm_text"
export const WM_IMAGE = "wm_image"
