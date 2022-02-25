import { createWebHistory, createRouter } from "vue-router";
import Board from '../components/Board.vue';
//const Reservation = () => import('../components/Reservation.vue');

const routes = [
  {
    path: "/board",
    component: Board,
  },
  {
    path: "/",
    redirect: "/board",
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;