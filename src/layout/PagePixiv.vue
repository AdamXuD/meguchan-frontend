<template>
  <el-card
    v-loading="loading"
    element-loading-background="#fff"
    class="w-full h-full relative flex-auto md:w-2/3 lg:w-1/2 md:mx-auto"
    :body-style="{ height: '100%' }"
  >
    <div v-if="display">
      <ul class="w-5/6 md:w-3/5 mx-auto mb-6">
        <li v-for="(item, index) in imgList" :key="index">
          <el-image
            class="rounded"
            :src="convertImgUrl(item.large)"
            :preview-src-list="imgList.map((it) => convertImgUrl(it.original))"
            fit="contain"
            lazy
          />
        </li>
      </ul>
      <div class="flex flex-col item-center mx-auto w-5/6 md:flex-row">
        <div class="mb-8 md:mb-0 md:w-4/5 md:mr-8">
          <h1 class="text-primary">
            <span class="font-bold text-xl mr-4">{{ illustInfo.title }}</span>
            <a
              class="text-secondary text-sm whitespace-nowrap"
              :href="`https://www.pixiv.net/artworks/${pid}`"
              target="_block"
              >{{ `Pixiv ID: ${pid}` }}</a
            >
          </h1>
          <p class="text-secondary text-sm"></p>
          <p
            class="text-regular text-base my-1"
            v-html="illustInfo.caption"
          ></p>
          <ul class="my-2">
            <li
              v-for="(item, index) in illustInfo.tags"
              :key="index"
              class="mx-1 inline"
            >
              <span class="text-[#3D7699] text-base">{{
                `#${item.name}`
              }}</span>
              <span class="text-secondary text-sm mx-1">{{
                `${item.translated_name}`
              }}</span>
            </li>
          </ul>
          <ul class="text-secondary flex flex-row flex-nowrap">
            <li class="mr-4 flex flex-row items-center">
              <el-icon class="mx-1"><View /></el-icon>
              <span>{{ illustInfo.total_view }}</span>
            </li>
            <li class="mr-4 flex flex-row items-center">
              <el-icon class="mx-1"><Star /></el-icon>
              <span>{{ illustInfo.total_bookmarks }}</span>
            </li>
          </ul>
        </div>
        <a
          class="flex flex-row items-center justify-center md:w-1/5 md:flex-col"
          :href="`https://www.pixiv.net/users/${illustInfo.user.uid}`"
          target="_block"
        >
          <div class="mr-4 md:mx-4">
            <el-image
              alt=""
              fit="contain"
              :src="convertImgUrl(illustInfo.user.avatar)"
              class="w-20 h-20 rounded-full overflow-hidden"
            ></el-image>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-primary text-base font-bold">
              {{ illustInfo.user.name }}
            </div>
            <div class="text-secondary text-sm">
              {{ `@${illustInfo.user.account}` }}
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center" v-else>
      <img
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-60 h-60"
        :src="require('@/assets/404.gif')"
        alt=""
        @click="dameImgClicked"
      />
      <h1 class="text-2xl my-8">{{ hint }}</h1>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { View, Star } from "@element-plus/icons-vue";
import { getPixivData } from "@/api";
import { convertImgUrl } from "@/utils";

export default defineComponent({
  name: "PagePixiv",
  components: {
    View,
    Star,
  },
  props: {
    pid: {
      type: String,
    },
  },
  setup(props) {
    const loading = ref(true);
    const display = ref(true);
    const hint = ref("");

    const dame = ref(false);
    const count = ref(Math.round(Math.random() * (10 - 5 + 1) + 5));

    const imgList = reactive<Array<unknown>>([]);

    const illustInfo = reactive<{
      title: string;
      tags: Array<{ name: string; translated_name: string }>;
      caption: string;
      total_view: number;
      total_bookmarks: number;
      create_date: Date;
      user: unknown;
    }>({
      title: "",
      tags: [],
      caption: "",
      total_view: -1,
      total_bookmarks: -1,
      create_date: new Date(),
      user: {},
    });

    if (props.pid && props.pid.length >= 0 && /^\d+$/.test(props.pid)) {
      getPixivData(Number(props.pid)).then((resp) => {
        const { error, illust } = resp.data;
        if (illust) {
          const {
            x_restrict,
            page_count,
            image_urls,
            meta_single_page,
            meta_pages,
            title,
            tags,
            caption,
            total_view,
            total_bookmarks,
            create_date,
            user,
          } = illust;
          if (x_restrict) {
            hint.value = "前面的区域以后再来探索吧~";
            display.value = false;
            dame.value = true;
          }
          if (page_count === 1) {
            imgList.push({
              ...image_urls,
              original: meta_single_page.original_image_url,
            });
          } else {
            imgList.push(
              ...meta_pages.map(
                (item: { image_urls: unknown }) => item.image_urls
              )
            );
          }
          illustInfo.title = title;
          illustInfo.tags = tags;
          illustInfo.caption = caption;
          illustInfo.total_view = total_view;
          illustInfo.total_bookmarks = total_bookmarks;
          illustInfo.create_date = new Date(create_date);
          illustInfo.user = {
            uid: user.id,
            name: user.name,
            account: user.account,
            avatar: user.profile_image_urls.medium,
          };
          document.title = title;
        } else if (error) {
          hint.value = "该作品不存在，或无权访问。";
          document.title = "404喵~";
          display.value = false;
          console.error("An error occured.\n", error);
        } else {
          hint.value = "发生了不可预料的错误。";
          document.title = "404喵~";
          display.value = false;
          console.error("An unexcepted error occured.\n", resp);
        }
        loading.value = false;
      });
    } else {
      hint.value = "请求Pixiv ID非法。";
      document.title = "404喵~";
      display.value = false;
      loading.value = false;
    }

    const dameImgClicked = () => {
      if (dame.value && count.value !== 0) count.value--;
      if (count.value === 0) display.value = true;
    };

    return {
      convertImgUrl,
      dameImgClicked,
      loading,
      display,
      hint,
      imgList,
      illustInfo,
    };
  },
});
</script>

<style lang="scss" scoped></style>
