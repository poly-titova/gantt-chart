export default {
  slots: {
    'page.layout.navbar.tasks': [
      {
        name: 'Диаграмма Ганта',
        route: 'plugin-gantt.mainPage',
      },
    ],
  },
  modules: {
    menu: {
      items: [{
        id: 'plugin-gantt',
        title: window.t('plugin-gantt|Диаграмма Ганта'),
        icon: 'ghost',
        url: {
          route: 'plugin-gantt.mainPage',
        },
        order: 100,
      }],
    },
  },
};
