import { FC, useMemo } from 'react'
import styles from './SortingMenuDropdown.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { usePathname } from 'next/navigation'
import { DropdownMenu } from '~/components/DropdownMenu/DropdownMenu'
import { DropdownMenuOptionProps } from '~/components/DropdownMenu/DropdownMenuOption/DropdownMenuOption'
import { BsSortDown } from 'react-icons/bs'

interface Props {
  activeOption: PaginationSortingType
  options: PaginationSortingType[]
}

interface OptionalProps {
  loading: boolean
  visible: boolean
  linkMode: ElementLinkMode | undefined
  onClickOption: ((option: PaginationSortingType) => void) | undefined
}

export const SortingMenuDropdown: FC<Props & Partial<OptionalProps>> = ({
  activeOption,
  options,
  loading = false,
  visible = true,
  linkMode = undefined,
  onClickOption = undefined,
}) => {
  const { t } = useTranslation('sorting_menu_dropdown')
  const { query } = useRouter()
  const pathname = usePathname()

  const componentActiveSortingOption = useMemo(() =>
    fromOrderTypeToComponentSortingOption(activeOption),
  [activeOption])

  const dropdownMenuOptions: DropdownMenuOptionProps[] = options.map((option) => {
    const componentOption = fromOrderTypeToComponentSortingOption(option)

    if (linkMode) {
      const newQuery = { ...query }

      delete newQuery.page
      newQuery.order = String(option)

      const search = new URLSearchParams()

      Object.entries(newQuery).forEach(([key, value]) => {
        search.append(key, `${value}`)
      })

      return {
        title: t(componentOption.translationKey),
        active: componentOption.translationKey === componentActiveSortingOption.translationKey,
        link: {
          href: `${pathname}?${search.toString()}`,
          scroll: linkMode.scrollOnClick,
          shallow: linkMode.shallowNavigation,
          replace: linkMode.replace,
        },
        onClick: undefined,
      }
    }

    return {
      title: t(componentOption.translationKey),
      active: componentOption.translationKey === componentActiveSortingOption.translationKey,
      onClick: () => { if (onClickOption) { onClickOption(option) } },
    }
  })

  return (
    <div className={ `
      ${styles.sortingMenuDropdown__container}
      ${visible && !loading ? styles.sortingMenuDropdown__container_visible : ''}
    ` }>
      <DropdownMenu
        title={ t(componentActiveSortingOption.translationKey) }
        position={ 'right' }
        options={ dropdownMenuOptions }
        icon={ <BsSortDown /> }
        closeOnClickOption={ true }
      />
    </div>
  )
}
