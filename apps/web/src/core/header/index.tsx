import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { createContext, useContext } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

import { Logo, MenuLinks } from './menu-links'

type HeaderContextData = {
  toggle: () => void
  isOpen: boolean
}

const HeaderContext = createContext({} as HeaderContextData)
export const useHeaderCtx = () => useContext(HeaderContext)

export const Header = () => {
  const { isOpen, onToggle: toggle } = useDisclosure()

  return (
    <HeaderContext.Provider value={{ toggle, isOpen }}>
      <Flex
        as='nav'
        align='center'
        justify='space-between'
        wrap='wrap'
        w='100%'
        px='3'
        bg='white'
        borderBottom='1px solid #f0f2f5'
      >
        <Logo />
        <ToggleMenu />
        <MenuLinks />
      </Flex>
    </HeaderContext.Provider>
  )
}

const ToggleMenu = () => {
  const { toggle, isOpen } = useHeaderCtx()

  return (
    <Box
      display={{ base: 'block', md: 'none' }}
      onClick={toggle}
      cursor='pointer'
    >
      {isOpen ? <FaTimes /> : <FaBars />}
    </Box>
  )
}
