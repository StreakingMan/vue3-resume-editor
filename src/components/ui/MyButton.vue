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
                ['default', 'blocked', 'pressed'].includes(value),
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
@import 'src/styles/color';
@import 'src/styles/elevation';
.my-btn {
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    display: inline-block;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 12px 16px;
    font-weight: bold;
    min-width: 64px;
    color: white;
    outline: none;
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
        &pressed {
            @include elevation(0);
            &:hover {
                @include elevation(0);
            }
        }
    }

    &--color- {
        &default {
            @include bgColor('primary');
        }
        &light {
            @include bgColor('primary-light');
        }
        &dark {
            @include bgColor('primary-dark');
        }
        &accent {
            @include bgColor('accent');
        }
    }
}
</style>
