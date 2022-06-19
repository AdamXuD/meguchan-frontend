function convertImgUrl(url: string) {
  if (url) {
    const ret = new URL(url);
    ret.hostname = process.env.VUE_APP_PXIMG_PROXY as string;
    return ret.toString();
  } else {
    return "";
  }
}

export { convertImgUrl };
