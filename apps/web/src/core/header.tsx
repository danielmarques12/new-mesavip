import {
  Box,
  Flex,
  Image,
  Stack,
  Text,
  TextProps,
  useDisclosure,
} from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { createContext, useContext } from 'react'
import { FaBars, FaGithub, FaTimes } from 'react-icons/fa'

type HeaderContextData = {
  toggle: () => void
  isOpen: boolean
}

const HeaderContext = createContext({} as HeaderContextData)
const useHeaderCtx = () => useContext(HeaderContext)

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

const HeaderMenu = () => {
  const { isOpen, toggle } = useHeaderCtx()
  const { status } = useSession()

  return (
    <Box
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{
        base: '100%',
        md: 'auto',
      }}
      mb={{ base: '4', md: '0' }}
    >
      <Stack
        spacing={{ base: '4', md: '8' }}
        direction={{ base: 'column', md: 'row' }}
        align='center'
        justify={{ base: 'center', md: 'flex-end' }}
        pt={{ base: 4, md: 0 }}
      >
        <Link
          href='https://github.com/danielmarques12/poneglyph'
          target='_blank'
          rel='noreferrer'
          passHref
          style={{ outline: 'none' }}
          onClick={toggle}
        >
          <FaGithub size='25' />
        </Link>

        <MenuButton href='/home'>Restaurants</MenuButton>

        <Flex
          gridGap={{ base: '2', md: '4' }}
          direction={{
            base: 'column',
            md: 'row',
          }}
        >
          {status === 'authenticated' ? (
            <>
              <MenuButton href='/reservations'>Reservations</MenuButton>
              <MenuButton href='/home' onClick={() => signOut()}>
                Sign out
              </MenuButton>
            </>
          ) : (
            <>
              <MenuButton href='/signin'>Sign in</MenuButton>
              <MenuButton href='/signup'>Sign up</MenuButton>
            </>
          )}
        </Flex>
      </Stack>
    </Box>
  )
}

interface MenuButtonProps extends TextProps {
  href: string
}

const MenuButton = ({ children, href, onClick }: MenuButtonProps) => {
  const { toggle } = useHeaderCtx()

  return (
    <Link href={href} passHref style={{ outline: 'none' }} onClick={toggle}>
      <Flex
        alignItems='center'
        w='32'
        h='12'
        onClick={onClick}
        color='gray.500'
        _hover={{ bg: { base: '', md: 'gray.100' } }}
        textAlign='center'
        rounded='lg'
      >
        <Text
          fontWeight='500'
          _hover={{ textDecor: { base: 'underline', md: 'unset' } }}
          mx='auto'
        >
          {children}
        </Text>
      </Flex>
    </Link>
  )
}
