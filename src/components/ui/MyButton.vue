<template>
    <button
        class="my-btn"
        :class="[
            `my-btn--size-${size}`,
            `my-btn--type-${type}`,
            `my-btn--color-${color}`,
        ]"
        @click="$emit('click', $event)"
    >
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MyButton',
    props: {
        size: {
            type: String,
            default: 'default',
            validator: (value: string) =>
                ['default', 'small', 'large'].includes(value),
        },
        type: {
            type: String,
            default: 'default',
            validator: (value: string) =>
                ['default', 'blocked'].includes(value),
        },
        color: {
            type: String,
            default: 'default',
        },
    },
    emits: ['click'],
});
</script>

<style scoped lang="scss">
@import 'src/styles/colors';
@import 'src/styles/elevations';
.my-btn {
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 12px 16px;
    font-weight: bold;
    min-width: 64px;
    color: $primary-color-text;
    @include elevation(2);
    @include elevationTransition();

    &:hover {
        @include elevation(8);
    }

    &--size- {
        &default {
            font-size: 0.875rem;
        }
        &large {
            font-size: 1rem;
        }
    }

    &--type- {
        &default {
            //
        }
        &blocked {
            display: block !important;
            width: 100%;
        }
    }

    &--color- {
        &default {
            background-color: $primary-color;
        }
        &light {
            background-color: $primary-color-light;
        }
        &accent {
            background-color: $accent-color;
        }
    }

    &--state-1 {
        width: 496px;
        height: 696px;
    }
}
</style>
