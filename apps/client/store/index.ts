import { IGroup } from '@tipovacka/models';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

export const state = () => ({
  group: {} as IGroup,
  alert: {
    color: '',
    message: '',
  },
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  upcomingGame: (state) => state.group.upcomingGame,
  followedTeam: (state) => state.group.followedTeams[0],
  latestSeason: (state) => {
    const followedTeam = state.group.followedTeams[0];
    const seasons = followedTeam.seasons;

    return seasons[seasons.length - 1].season;
  },
};

export const mutations: MutationTree<RootState> = {
  SET_GROUP: (state, group) => (state.group = group),
  SHOW_ALERT: (state, payload) => (state.alert = payload),
};

export const actions: ActionTree<RootState, RootState> = {
  async fetchGroupData({ commit }, groupId: string) {
    const group: IGroup = await this.$axios.$get('/groups', {
      params: { group: groupId },
    });
    commit('SET_GROUP', group);
  },
  showAlert({ commit }, payload: { color: string; text: string }) {
    commit('SHOW_ALERT', payload);
  },
};
