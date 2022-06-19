<template>
  <el-card
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
    <div class="w-full flex flex-col justify-center items-center">
      <img
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-60 h-60"
        :src="require('@/assets/404.gif')"
        alt=""
        @click="dameImgClicked"
      />
      <h1 class="text-2xl my-8">这里什么也没有捏~</h1>
      <p class="text-secondary text-sm">怎么会是呢，快去找惠酱问问吧？</p>
      <p class="text-additional text-xs">（本模块暂不打算独立提供服务）</p>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageHome",
  setup() {
    document.title = "怎么会是呢";
    return {};
  },
});
</script>

<style lang="scss" scoped></style>
