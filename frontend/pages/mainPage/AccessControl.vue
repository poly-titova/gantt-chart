<template>
  <ui-sidebar
    v-model="isSidebarVisible"
    :title="`Доступы к проекту «${currentView.title}»`"
    class="sidebar"
    @hide="resetState"
  >
    <el-table
      :data="users"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="Пользователь">
      </el-table-column>
      <el-table-column
        prop="role"
        label="Права">
      </el-table-column>
      <el-table-column>
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteItem(row)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-form ref="form" :model="item" style="margin-left: 15px;">
      <div v-for="(user, index) in arrUsers" :key="index">
        <el-form-item
          prop="name"
          label="Пользователь">
          <orgschema-user-selector
            v-model="user.id"
            :font-size="14"
          />
        </el-form-item>

        <el-form-item
          prop="rights"
          label="Права">
          <el-select v-model="user.rights">
            <el-option
              v-for="option in options"
              :key="option.label"
              :label="option.label"
              :value="option.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-button
        size="small"
        @click="addUser"
      >
        <span>+ Добавить пользователя</span>
      </el-button>

      <el-form-item style="margin-top: 20px; margin-bottom: 10px; width: 100%">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button
              style="position: relative; width: 100%; margin-right: 10px"
              @click="close"
            >
              <span>Отменить</span>
            </el-button>
          </el-col>

          <el-col :span="12">
            <el-button
              type="success"
              plain
              style="position: relative; width: 100%; margin: 0px 10px"
              @click="submit"
            >
              <span>Сохранить</span>
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </ui-sidebar>
</template>

<script>
export default {
  props: {
    value: Object,
    currentView: String,
    profiles: Array,
  },
  data() {
    return {
      isSidebarVisible: false,
      item: {},
      users: [],
      arrUsers: [],
      options: [
        {
          value: 'read',
          label: 'Просмотр проекта'
        }, {
          value: 'create',
          label: 'Просмотр + создание задач'
        }, {
          value: 'work',
          label: 'Работа с проектом'
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
      this.currentView.users.map(user =>
        this.users.push({
          id: user.id,
          rights: user.rights,
          name: this.profiles[user.id].name,
          role: this.options.find(item => item.value == user.rights).label,
        })
      );
    },
    close() {
      this.isSidebarVisible = false;
      this.users = [];
    },
    addUser() {
      return this.arrUsers.push(
        {
          id: '',
          rights: '',
        }
      );
    },
    async deleteItem(row) {
      this.users = this.users.filter(user => user.id !== row.id);
    },
    async submit() {
      this.arrUsers.map(user =>
        this.users.push(user)
      );
      this.$emit('input', this.users);
      this.close();
    },
  },
};
</script>

<style lang="less" scoped>
.sidebar {
  top: 0 !important;
  width: 650px;
  background: white;
}

.table {
  width: 620px;
  font-size: 12px;
  line-height: 23px;
  padding-left: 10px;
  margin-bottom: 10px;
  border: none;
}

.form_button {
  margin-top: 10px;
}
</style>
