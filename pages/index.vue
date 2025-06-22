<script setup>
let lb_resp = await $fetch(`https://mirage.yuv.pink/api/v1/leaderboard/total`);
let lb_data = ref(lb_resp.leaderboard);

const selected = ref("total");

watch(selected, async (selectedValue) => {
  const freqEndpts = {
    total: `https://mirage.yuv.pink/api/v1/leaderboard/total`,
    daily: `https://mirage.yuv.pink/api/v1/leaderboard/daily`,
    weekly: `https://mirage.yuv.pink/api/v1/leaderboard/weekly`,
    monthly: `https://mirage.yuv.pink/api/v1/leaderboard/monthly`,
  };

  const lb_resp = await $fetch(freqEndpts[selectedValue]);
  lb_data.value = lb_resp.leaderboard;
});

const activeFilter = ref("total");

function setFilter(type) {
  activeFilter.value = type;
}

function perRoundCalc(playerStat, gamesPlayed) {
  return Math.round(playerStat / gamesPlayed).toLocaleString()
}

let search = ref("");

const filteredPlayers = computed(() => {
  return lb_data.value.filter(player =>
    player.OnlineID.toLowerCase().includes(search.value.toLowerCase())
  )
})

const lbPerRoundData = computed(() => {
  return [...lb_data.value]
    .map(player => ({
      ...player,
      TotalKills: Math.round(player.TotalKills / player.GamesPlayed),
      TotalDeaths: Math.round(player.TotalDeaths / player.GamesPlayed),
      TotalVdollar: Math.round(player.TotalVdollar / player.GamesPlayed),
      TotalDistance: Math.round(player.TotalDistance / player.GamesPlayed)
    }))
    .sort((a, b) => b.TotalVdollar - a.TotalVdollar)
})

const perRoundFilteredPlayers = computed(() => {
  return lbPerRoundData.value.filter(player =>
    player.OnlineID.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <div class="leaderboard-top-three">
    <div class="leaderboard-top-three-profile">
      <div class="leaderboard__ranking-circle leaderboard__ranking-circle-one">
        <div>2<sup>nd</sup></div>
      </div>
      <img src="/images/merc_sniper_profile.png" alt="" />
      <div class="top-three-info">
        <div v-if="activeFilter == 'total'" class="top-three-info__second-place-username">
          {{ lb_data[1].OnlineID }}
        </div>
        <div v-else-if="activeFilter == 'perRound'" class="top-three-info__second-place-username">
          {{ lbPerRoundData[1].OnlineID }}
        </div>
        <div>
          <div v-if="activeFilter == 'total'">
            <img src="/images/vektan_dollar.svg" alt="" />{{
              lb_data[1].TotalVdollar.toLocaleString()
            }}
          </div>
          <div v-else-if="activeFilter == 'perRound'">
            <img src="/images/vektan_dollar.svg" alt="" />{{
              lbPerRoundData[1].TotalVdollar.toLocaleString()
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="leaderboard-top-three-profile first-place">
      <div class="leaderboard__ranking-circle leaderboard__ranking-circle-two">
        <div>1<sup>st</sup></div>
      </div>
      <img src="/images/merc_ar_profile.png" alt="Vektan currency symbol." />
      <div class="top-three-info">
        <div v-if="activeFilter == 'total'" class="top-three-info__first-place-username">
          {{ lb_data[0].OnlineID }}
        </div>
        <div v-else-if="activeFilter == 'perRound'" class="top-three-info__first-place-username">
          {{ lbPerRoundData[0].OnlineID }}
        </div>
        <div>
          <div v-if="activeFilter == 'total'">
            <img
              src="/images/vektan_dollar.svg"
              alt="Vektan currency symbol."
            />{{ lb_data[0].TotalVdollar.toLocaleString() }}
          </div>
          <div v-else-if="activeFilter == 'perRound'">
            <img
              src="/images/vektan_dollar.svg"
              alt="Vektan currency symbol."
            />{{ lbPerRoundData[0].TotalVdollar.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>

    <div class="leaderboard-top-three-profile">
      <div
        class="leaderboard__ranking-circle leaderboard__ranking-circle-three"
      >
        <div>3<sup>rd</sup></div>
      </div>
      <img
        src="/images/merc_explosive_profile.png"
        alt="Vektan currency symbol."
      />
      <div class="top-three-info">
        <div v-if="activeFilter == 'total'" class="top-three-info__third-place-username">
          {{ lb_data[2].OnlineID }}
        </div>
        <div v-else-if="activeFilter == 'perRound'" class="top-three-info__third-place-username">
          {{ lbPerRoundData[2].OnlineID }}
        </div>
        <div>
          <div v-if="activeFilter == 'total'">
            <img
              src="/images/vektan_dollar.svg"
              alt="Vektan currency symbol."
            />{{ lb_data[2].TotalVdollar.toLocaleString() }}
          </div>
          <div v-if="activeFilter == 'perRound'">
            <img
              src="/images/vektan_dollar.svg"
              alt="Vektan currency symbol."
            />{{ lbPerRoundData[2].TotalVdollar.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="leaderboard">
    <div class="leaderboard__filter-family">
      <div>
        <div class="leaderboard__filter-parent-label">Scores</div>
        <div class="leaderboard__filters">
          <div
            :class="{ active: activeFilter === 'total' }"
            @click="setFilter('total')"
            class="leaderboard__filters leaderboard__filter--total"
          >
            Total
          </div>
          <div
            :class="{ active: activeFilter === 'perRound' }"
            @click="setFilter('perRound')"
            class="leaderboard__filters leaderboard__filter--per-round"
          >
            Per Round
          </div>
        </div>
      </div>

      <div>
        <div class="leaderboard__filter-parent-label">Frequency</div>
        <select v-model="selected" name="freq" id="freq">
          <option value="total">All-time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div class="leaderboard__search">
        <div class="leaderboard__search-label">Search</div>
        <input v-model="search" class="leaderboard__search-form" type="search" />
      </div>
    </div>

    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Online ID</th>
          <th>Kills</th>
          <th>Deaths</th>
          <th>K/D Ratio</th>
          <th>Vektan</th>
          <th>Games Played</th>
          <th>Distance</th>
        </tr>
      </thead>
      <tbody id="leaderboard-body">
        <tr v-if="activeFilter == 'total'" v-for="(player, index) in filteredPlayers" bgcolor="#F5F3F1">
          <td>{{ index + 1 }}</td>
          <td>{{ player.OnlineID }}</td>
          <td>{{ player.TotalKills.toLocaleString() }}</td>
          <td>{{ player.TotalDeaths.toLocaleString() }}</td>
          <td>{{ (player.TotalKills / player.TotalDeaths).toFixed(2) }}</td>
          <td>{{ player.TotalVdollar.toLocaleString() }}</td>
          <td class="leaderboard-table__games-played">
            {{ player.TotalWins.toLocaleString() }}
            <img src="/images/arrow_up.svg" alt="Games won." />
            {{ player.TotalLosses.toLocaleString() }}
            <img src="/images/arrrow_down.svg" alt="Games lost." />
          </td>
          <td>{{ player.TotalDistance.toLocaleString() }}m</td>
        </tr>
        <tr v-else-if="activeFilter == 'perRound'" v-for="(player, index) in perRoundFilteredPlayers" bgcolor="#F5F3F1">
          <td>{{ index + 1 }}</td>
          <td>{{ player.OnlineID }}</td>
          <td>{{ player.TotalKills.toLocaleString() }}</td>
          <td>{{ player.TotalDeaths.toLocaleString() }}</td>
          <td>{{ (player.TotalKills / player.TotalDeaths).toFixed(2) }}</td>
          <td>{{ player.TotalVdollar.toLocaleString() }}</td>
          <td class="leaderboard-table__games-played">
            {{ player.TotalWins.toLocaleString() }}
            <img src="/images/arrow_up.svg" alt="Games won." />
            {{ player.TotalLosses.toLocaleString() }}
            <img src="/images/arrrow_down.svg" alt="Games lost." />
          </td>
          <td>{{ perRoundCalc(player.TotalDistance, player.GamesPlayed) }}m</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.active {
  background-color: #734b23 ;
  color: #f5f3f1;
  cursor: default;
}
</style>