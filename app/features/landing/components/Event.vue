<script setup>
import EventCard from "./EventCard.vue";

const mainEvent = {
  image: "/images/anniversary-20th.png",
  date: "12 Oktober, 2025",
  title: "Ulang Tahun Ke-20 Alumni KOMPAK 98",
  description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis consectetur minima cupiditate, quae et atque id soluta placeat? Minus inventore placeat natus accusamus numquam nihil nemo enim ullam commodi consequatur dolorum nam incidunt voluptatem reprehenderit suscipit, veniam possimus libero maiores.",
};

const sideEvents = [
  {
    image: "/images/bukber.webp",
    date: "15 Maret, 2025",
    title: "Buka Bersama",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi incidunt beatae ducimus, quae vitae repudiandae maxime eos. Excepturi, odit molestias!",
  },
  {
    image: "/images/seminar.png",
    date: "5 Januari, 2025",
    title: "Seminar Leadership",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod consequatur, voluptate ipsa architecto dicta incidunt velit optio, soluta alias aliquam cupiditate sed deserunt fugiat placeat.",
  },
];
</script>

<template>
  <div class="container pt-32 pb-20 mx-auto px-4">
    <div class="flex flex-col gap-2 items-center mb-20">
      <h1 class="text-primary text-4xl font-medium">
        Acara Terbaru
      </h1>
      <div class="w-24 h-1.5 rounded-full bg-[#8f0044]" />
    </div>

    <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-16">
      <div class="md:col-span-2">
        <EventCard
          :image="mainEvent.image"
          :date="mainEvent.date"
          :title="mainEvent.title"
          :description="mainEvent.description"
          is-main
        />
      </div>

      <div class="grid grid-cols-1 gap-10">
        <EventCard
          v-for="(event, index) in sideEvents"
          :key="index"
          :image="event.image"
          :date="event.date"
          :title="event.title"
          :description="event.description"
        />
      </div>
    </div>
  </div>
</template>
