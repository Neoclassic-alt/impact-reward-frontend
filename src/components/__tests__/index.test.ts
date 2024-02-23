import { type Mock, beforeEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AlertBlock from '@/components/common/AlertBlock.vue'
import { useRoute, useRouter } from 'vue-router'
import NavigationMenu from '@/components/app/NavigationMenu.vue'
import { createTestingPinia } from '@pinia/testing'

describe.concurrent('AlertBlock', () => {
  test('Info', ({ expect }) => {
    const wrapper = mount(AlertBlock)

    expect(wrapper.find('.alert-info').exists()).toBe(true)
    expect(wrapper.find('[alt="Info icon"]').exists()).toBe(true)
  })

  test('Error', async ({ expect }) => {
    const wrapper = mount(AlertBlock)

    await wrapper.setProps({ type: 'error' })

    expect(wrapper.find('.alert-error').exists()).toBe(true)
    expect(wrapper.find('[alt="Error icon"]').exists()).toBe(true)
  })

  describe('Close', async () => {
    const wrapper = mount(AlertBlock)
    await wrapper.setProps({ closable: true })

    test('Closable', ({ expect }) => {
      expect(wrapper.find('.alert a[href="#"]').exists()).toBe(true)
    })

    test('Closes', async ({ expect }) => {
      await wrapper.get('.alert a[href="#"]').trigger('click')

      expect(wrapper.find('.alert').exists()).toBe(false)
    })
  })
})

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: () => {},
  })),
}))

describe('Navigation menu', () => {
  beforeEach(() => {
    ;(useRoute as Mock).mockImplementationOnce(() => ({
      name: 'GeneralInfo',
    }))
    ;(useRouter as Mock).mockImplementationOnce(() => ({
      push: vi.fn(),
    }))
  })

  test('Navmenu on general info page', async () => {
    const wrapper = mount(NavigationMenu, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn(),
          }),
        ],
      },
    })

    expect(wrapper.find('.active').exists()).toBe(true)
    expect(wrapper.find('.active .nav__text').text()).toBe('Информация')
  })
})
