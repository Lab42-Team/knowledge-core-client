<template>
    <div>
        <div class="card">
            <div class="card-header">
                Просмотр новости
            </div>
            <div class="card-body">
                <div v-if="news">
                    <div>Id: {{ news.id }}</div>
                    <div>Name: {{ news.name }}</div>
                    <div>Description: {{ news.description }}</div>
                    <div>Status: {{ news.status }}</div>
                    <div>Date: {{ news.date }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {getNewsById} from '@/admin/api/news';
export default {
    name: "Show",

    data(){
        return {
            news: null
        }
    },

    async mounted() {
        await this.getNewsItem(this.$route.params.id);
    },

    methods: {
        async getNewsItem(id) {
            this.news = await getNewsById(id);
        }

    }

}
</script>

<style scoped>

</style>
