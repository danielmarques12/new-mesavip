import { Box, Flex, Image, useDisclosure } from '@chakra-ui/react'
import Link from 'next/link'
import { createContext, useContext } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

import { HeaderMenu } from './menu-links'

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
        <HeaderMenu />
      </Flex>
    </HeaderContext.Provider>
  )
}

const Logo = () => {
  const { toggle } = useHeaderCtx()

  return (
    <Link
      href='/restaurants'
      passHref
      style={{ outline: 'none' }}
      onClick={toggle}
    >
      <Image w='40' h='20' src='https://bit.ly/2YFsIhw' alt='Mesavip logo' />
    </Link>
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
