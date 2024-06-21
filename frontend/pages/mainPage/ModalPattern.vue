<template>
  <el-dialog
    title="Создание шаблона"
    :visible.sync="dialogPatternVisible">
    <el-form ref="form" :model="item">
      <el-form-item
        prop="title"
        label="Название шаблона"
        :rules="[{ required: true, message: 'Введите название шаблона'}]">
        <el-input v-model="item.title" size="small"/>
      </el-form-item>

      <div v-for="(task, index) in arrTasks" :key="index">
        <el-form-item
          prop="name"
          label="Название задачи">
          <el-input
            v-model="task.name"
            size="small"
          />
        </el-form-item>

        <el-form-item
          prop="description"
          label="Описание задачи">
          <el-input
            v-model="task.description"
            type="textarea"
            :rows="2"
            size="small"
          />
        </el-form-item>

        <el-form-item label="Планируемое время:" prop="time_plan">
          <el-input-number v-model="task.time_plan" size="small" />
        </el-form-item>
      </div>

      <el-button
        size="small"
        @click="addTask"
      >
        <span>+ Добавить задачу</span>
      </el-button>

      <el-form-item class="form_button">
        <el-button
          size="small"
          @click="$emit('show', false);"
        >
          <span>Отмена</span>
        </el-button>

        <el-button
          type="primary"
          size="small"
          @click="submit"
        >
          <span>Создать</span>
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: Object,
    dialogPatternVisible: Boolean,
  },
  data() {
    return {
      item: {},
      newTask: {},
      arrTasks: [
        {
          name: '',
          type: 'template',
          description: '',
          time_plan: '',
          parent_data: null,
          checklist_items: [],
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
    handleClose(done) {
      this.$confirm('Вы уверены, что хотите закрыть окно?')
        .then(_ => {
          done();
          this.$emit('show', false);
        })
        .catch(_ => { });
    },
    addTask() {
      return this.arrTasks.push(
        {
          name: '',
          description: '',
          time_plan: 0,
          parent_data: null,
          checklist_items: [],
        }
      );
    },
    async submit() {
      try {
        await this.$refs.form.validate();
      } catch (e) {
        this.$uiNotify.error('Заполните необходимые поля');
        return;
      }

      this.item.type = 'pattern';
      this.$emit('input', this.item, this.arrTasks);
      this.$emit('show', false);
      this.resetState();
    },
    resetState() {
      this.$emit('hide');
    },
  },
};
</script>

<style lang="less" scoped>
.form_button {
  margin-top: 10px;
}
</style>
