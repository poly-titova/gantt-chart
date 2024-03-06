<template>
  <ui-sidebar
    v-model="isSidebarVisible"
    title="Добавить кассу"
    class="sidebar"
    @hide="resetState"
  >
    <p>Заголовок: {{ task.name }}</p>
    <p>Описание: {{ getText(task.description) }}</p>
    <p>Исполнитель: {{ task.responsible_user_ids }}</p>
    <p>Начало работы: {{ task.start_date }}</p>
    <p>Завершение работы: {{ task.finish_date }}</p>  
  </ui-sidebar>
</template>

<script>
export default {
  props: {
    task: Array,
  },
  data() {
    return {
      isSidebarVisible: false,
    };
  },
  methods: {
    open() {
      this.isSidebarVisible = true;
    },
    handleModalHide() {
      this.selectedCashbox = this.createDefaultCashbox();
    },
    getText(str) {
      if (str !== null) {
        const startIndex = str.indexOf('<p>') + 3;
        const endIndex = str.indexOf('</p>', startIndex);
        const text = str.substring(startIndex, endIndex);

        return text;
      }
      
      return str;
    },
  },
};
</script>

<style lang="less" scoped>
.sidebar {
  top: 0 !important;
  width: 70% !important;
  background: white;

  .table {
    width: 100%;
    padding-left: 20px;
  }

  .content {
    padding-top: 20px;
    padding-right: 30px;

    .text-editor {
      line-height: 20px;
    }
  }
}
</style>
