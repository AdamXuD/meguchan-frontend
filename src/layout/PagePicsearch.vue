<template>
  <el-card
    v-loading="loading"
    element-loading-background="#fff"
    class="w-full h-full relative flex-auto md:w-2/3 lg:w-1/2 md:mx-auto flex flex-col"
    :body-style="{
      flex: '1 1 0',
      'min-height': '0',
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'start',
      'justify-content': 'space-between',
    }"
  >
    <template #header v-if="!fourOfour">
      <div class="flex flex-row h-32 w-full border-b-slate-500">
        <el-image
          class="rounded w-1/2"
          fit="contain"
          :src="searchImg"
          :preview-src-list="[searchImg]"
          referrerpolicy="no-referrer"
          lazy
        />
        <div class="flex-1 flex flex-col justify-center items-center">
          <h1 class="t text-xl font-bold">您要搜索的图片</h1>
        </div>
      </div>
    </template>
    <el-scrollbar class="w-full flex-1" v-if="show">
      <ul class="mr-4">
        <li
          v-for="(item, index) in resultList"
          :key="index"
          class="flex flex-row min-h-48 mb-4 pb-4 border-b"
        >
          <el-image
            class="rounded w-1/3 mr-4"
            :src="item.thumbnail"
            :preview-src-list="[item.thumbnail]"
            fit="contain"
            lazy
          />
          <div class="flex-1 flex flex-col justify-between">
            <h1 class="mb-2">
              <el-tag
                effect="dark"
                round
                size="small"
                class="mr-1"
                v-if="item.similarity"
              >
                {{ item.similarity }}
              </el-tag>
              <span class="font-bold break-all" v-if="item.title">
                {{ item.title }}
              </span>
              <span v-else class="font-bold text-regular">无标题</span>
            </h1>
            <p class="text-sm mb-2">
              <span
                class="whitespace-pre-wrap break-all text-regular"
                v-if="item.other_info"
              >
                {{ item.other_info }}
              </span>
              <span class="text-secondary" v-else>无详细信息</span>
            </p>
            <ul class="flex flex-row">
              <li v-for="(it, i) in item.relative_url" :key="i" class="mr-2">
                <el-popconfirm
                  confirm-button-text="是"
                  cancel-button-text="否"
                  :icon="Link"
                  :title="`接下来将跳转到${it}，是否继续？`"
                  @confirm="openUrl(it)"
                >
                  <template #reference>
                    <el-button size="small" :icon="Link" type="info" circle />
                  </template>
                </el-popconfirm>
              </li>
            </ul>
            <p class="text-additional text-xs text-right">
              {{ `${item.engine}` }}
            </p>
          </div>
        </li>
        <li v-if="warningMsg">
          <h1 class="font-bold text-sm mb-2">请求提示信息</h1>
          <p class="whitespace-pre-wrap text-xs text-secondary">
            {{ warningMsg }}
          </p>
        </li>
      </ul>
    </el-scrollbar>
    <div
      v-else-if="fourOfour"
      class="w-full flex-1 flex flex-col justify-center items-center"
    >
      <img
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-60 h-60"
        :src="require('@/assets/404.gif')"
        alt=""
        @click="dameImgClicked"
      />
      <h1 class="text-2xl my-8">前面的区域以后再来探索吧~</h1>
      <p class="text-regular text-sm">{{ errorMsg }}</p>
    </div>
    <div class="w-full flex-1 flex flex-col justify-center items-center" v-else>
      <p class="text-regular text-xl mb-16">
        搜索结果由第三方提供，可能包含不适内容，是否继续？
      </p>
      <div>
        <el-button @click="onCancelShowResult">取消</el-button>
        <el-button type="primary" @click="onComfirmShowResult">确定</el-button>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { getPicsearchData } from "@/api";
import { defineComponent, reactive, ref } from "vue";
import { Link } from "@element-plus/icons-vue";

export default defineComponent({
  name: "PagePicsearch",
  props: {
    short: {
      type: String,
    },
  },
  setup(props) {
    const loading = ref(true);
    const show = ref(false);
    const warningMsg = ref("");
    const searchImg = ref("");
    const resultList = reactive<Array<unknown>>([]);

    const fourOfour = ref(false);
    const errorMsg = ref("");

    if (props.short && props.short.length >= 0) {
      getPicsearchData(props.short).then((resp) => {
        const { success, msg, data } = resp.data;
        if (success) {
          const { pic_url, hint, results } = data;
          searchImg.value = pic_url;
          warningMsg.value = hint.trim();
          resultList.push(...results);
          document.title = "搜索结果";
        } else {
          fourOfour.value = true;
          errorMsg.value = msg;
          document.title = "怎么会是呢";
        }
        loading.value = false;
      });
    }

    const openUrl = (url: string) => window.open(url, "_blank");

    const onComfirmShowResult = () => (show.value = true);
    const onCancelShowResult = () => {
      fourOfour.value = true;
      errorMsg.value = "用户拒绝查看结果。";
    };

    return {
      loading,
      show,
      fourOfour,
      errorMsg,
      searchImg,
      resultList,
      warningMsg,
      onComfirmShowResult,
      onCancelShowResult,
      openUrl,
      Link,
    };
  },
});
</script>

<style lang="scss" scoped></style>
