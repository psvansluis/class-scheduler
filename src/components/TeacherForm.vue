<template>
  <div>
    <h3>Teacher Form</h3>
    <input v-model="newTeacherName" placeholder="Enter teacher name" />
    <select v-model="newTeacherSkill" name="Enter skill">
      <option v-for="skill in skills" :key="skill" :value="skill">
        {{ skill }}
      </option>
    </select>
    <button
      :disabled="!newTeacherName || !newTeacherSkill"
      @click="teachers.push({ name: newTeacherName, skill: newTeacherSkill })"
    >
      Add Teacher
    </button>
    <p>Teachers:</p>
    <ul>
      <li v-for="(teacher, index) in teachers" :key="index">
        {{ teacher.name }} - {{ teacher.skill }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const newTeacherName = ref("");
const newTeacherSkill = ref("");
const teachers = ref<{ name: string; skill: string }[]>([]);

defineProps({ skills: Set<string> });
</script>
