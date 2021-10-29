/**
 * @author zhangjunling
 * @date 2020/9/2/0002 17:24
 */
import Vue from 'vue';
import VueRouter from 'vue-router';


import App from './pages/App.vue';
import Index from './pages/index.vue';
import a from './pages/a.vue';

Vue.use(VueRouter);

// 创建路由列表
const router = new VueRouter({
    routes: [{
            path: '/',
            component: Index
        },
        {
            path: '/a',
            component: a
        }
    ]
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
