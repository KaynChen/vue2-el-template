<template>
  <div class="app-wrapper">
    <HeaderView />
    <main class="p-layout_main">
      <SidebarView />
      <section class="p-layout_content">
        <TagView />
        <div class="p-layout_fill">
          <router-view />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import HeaderView from './HeaderMenu'
import SidebarView from './SidebarMenu'
import TagView from './TagMenu'

export default {
  components: {
    HeaderView,
    SidebarView,
    TagView
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-layout {
    &_main {
      padding-top: 56px;
      height: 100%;
    }
    &_content {
      margin-left: 200px;
      height: 100%;
    }
    &_fill {
      padding: 48px 0 0;
      height: inherit;
      overflow-y: auto;
    }
  }
}
.app-wrapper {
  height: 100%;
}
</style>
