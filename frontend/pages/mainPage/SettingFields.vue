<template>
  <ui-sidebar
    v-model="isSidebarVisible"
    title="Дополнительные поля задач"
    class="sidebar"
    @hide="resetState"
  >
    <el-table
      :data="tableFields"
      stripe
      style="width: 100%; font-size: 12px; line-height: 23px;">
      <el-table-column
        prop="name"
        label="Название">
      </el-table-column>
      <el-table-column
        prop="type"
        label="Тип">
      </el-table-column>
      <el-table-column
        prop="default"
        label="Значение по умолчанию">
      </el-table-column>
      <el-table-column
        prop="required"
        label="Обязательное">
      </el-table-column>
      <el-table-column
        prop="hidden"
        label="Скрытое">
      </el-table-column>
      <el-table-column
        prop="order"
        label="Сортировка">
      </el-table-column>
      <el-table-column
        prop="inherit"
        label="Наследует значения">
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button
      type="success"
      size="medium"
      @click="addField"
    >
      <span>Добавить поле</span>
    </el-button>
  </ui-sidebar>
</template>

<script>
export default {
  props: {
    value: Object,
    currentProject: String,
    profiles: Array,
  },
  data() {
    return {
      isSidebarVisible: false,
      tableFields: [
        {
          name: 'Тест',
          type: 'Список',
          order: 100
        }
      ],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.item = $utils.object.clone(val);
      },
    },
  },
  methods: {
    open() {
      this.isSidebarVisible = true;
    },
    close() {
      this.isSidebarVisible = false;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    addField() {
      console.log('success')
    }
  },
};
</script>

<style lang="less" scoped>
.sidebar {
  top: 0 !important;
  width: 750px;
  background: white;
}
</style>
