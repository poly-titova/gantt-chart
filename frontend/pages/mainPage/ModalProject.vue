<template>
  <el-dialog
    title="Создание проекта"
    :visible.sync="dialogVisible">
    <el-form ref="form" :model="item">
      <el-form-item
        prop="title"
        label="Название"
        :label-width="formLabelWidth"
        :rules="[{ required: true, message: 'Введите название проекта'}]">
        <el-input v-model="item.title" size="small"/>
      </el-form-item>

      <el-form-item
        prop="start_date"
        label="Старт"
        :label-width="formLabelWidth"
        :rules="[{ required: true, message: 'Заполните дату'}]"
      >
        <el-date-picker
          v-model="item.start_date"
          type="date"
          placeholder="Заполните дату"
          size="small"
        />
      </el-form-item>

      <el-form-item
        prop="finish_date"
        label="Финиш"
        :label-width="formLabelWidth"
        :rules="[{ required: true, message: 'Заполните дату'}]"
      >
        <el-date-picker
          v-model="item.finish_date"
          type="date"
          placeholder="Заполните дату"
          size="small"
        />
      </el-form-item>

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
    dialogVisible: Boolean,
  },
  data() {
    return {
      item: {},
      formLabelWidth: '100px'
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
    async submit() {
      try {
        await this.$refs.form.validate();
      } catch (e) {
        this.$uiNotify.error('Заполните необходимые поля');
        return;
      }
      this.$emit('input', this.item);
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
  margin-top: 25px;
  margin-left: 100px;
}
</style>
