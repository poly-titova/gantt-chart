<template>
  <ui-sidebar
    v-model="isSidebarVisible"
    :title="`Доступы к проекту «${currentProject}»`"
    class="sidebar"
    @hide="resetState"
  >
    <main style="padding: 15px;">
      <h1 style="font-weight: 600;">Доступы пользователей ({{ users }} чел.)</h1>
      <el-table
        :data="tableUsers"
        class="table">
        <el-table-column
          prop="name"
          label="Пользователь"
          width="250">
          <template slot-scope="scope">
            <el-select v-model="user.name" placeholder="Начните искать...">
              <el-option
                v-for="profile in profiles"
                :key="profile.id"
                :label="profile.name"
                :value="profile.id">
                <span style="float: left">{{ profile.id }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ profile.name }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          prop="rights"
          label="Права"
          width="240">
          <template slot-scope="scope">
            <el-select v-model="user.rights">
              <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          prop="role"
          label="Роль">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-close"
              @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="button-plus" type="primary" plain>+ Добавить пользователя</el-button>

      <el-divider style="margin: 14px 0px !important;"></el-divider>

      <h1 style="font-weight: 600;">Доступы должностей</h1>
      <el-table
        :data="tablePosition"
        class="table">
        <el-table-column
          prop="position"
          label="Должность"
          width="250">
          <template slot-scope="scope">
            <el-select v-model="position.position" placeholder="Начните искать...">
              <el-option
                v-for="profile in profiles"
                :key="profile.id"
                :label="profile.name"
                :value="profile.id">
                <span style="float: left">{{ profile.id }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ profile.name }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          prop="rights"
          label="Права"
          width="170">
          <template slot-scope="scope">
            <el-select v-model="position.rights">
              <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
            <el-checkbox v-model="position.children">+ подчиненные</el-checkbox>
            <el-button
              size="mini"
              icon="el-icon-close"
              @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="additional">
          <template slot-scope="scope">
            <el-checkbox v-model="position.children" style="font-size: 11px;">+ подчиненные</el-checkbox>
            <el-button
              size="mini"
              icon="el-icon-close"
              @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="button-plus" type="primary" plain>+ Добавить должность</el-button>
    </main>

    <footer style="padding: 0px 10px; margin-bottom: 10px;">
      <el-button
        type="success"
        class="button-save"
        @click="submit"
      >
        <span>Сохранить</span>
      </el-button>
    </footer>
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
      user: {},
      position: {},
      tableUsers: [
        {
          name: 'Полина Титова',
          rights: 'Работа с доской + администрирование',
          role: 'Администратор'
        }
      ],
      tableUsers: [
        {
          name: 'Полина Титова',
          rights: 'Работа с доской + администрирование',
          role: 'Администратор'
        }
      ],
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
  computed: {
    item() {
      return this.task;
    },
    users(){
      return 0;
    }
  },
  methods: {
    open() {
      this.isSidebarVisible = true;
    },
    close() {
      this.isSidebarVisible = false;
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    async submit() {
      this.$emit('input', [ this.user, this.position ]);
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

.button-plus {
  font-size: 12px;
  padding: 7px 15px !important;
  margin-left: 8px;
  border-radius: 3px;
}

.button-save {
  padding: 8px 23px;
}
</style>
