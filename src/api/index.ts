import axios from "axios";

export function getPixivData(pid: number) {
  return axios.get(`https://${process.env.VUE_APP_MEGUCHAN_API}/pixiv/result`, {
    params: {
      pid,
    },
  });
}

export function getPicsearchData(short: string) {
  return axios.get(
    `http://${process.env.VUE_APP_MEGUCHAN_API}/picsearch/result`,
    {
      params: {
        key: short,
      },
    }
  );
}
