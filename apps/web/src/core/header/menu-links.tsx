import {
  Box,
  Link as ChakraLink,
  Flex,
  FlexProps,
  Image,
  LinkProps,
  Stack,
  StackProps,
  Text,
  TextProps,
} from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

import { useHeaderCtx } from '.'

export const MenuLinks = () => {
  const { status } = useSession()

  return (
    <MenuLinksContainer>
      <MenuItem
        href='https://github.com/danielmarques12/mesavip'
        target='_blank'
        rel='noreferrer'
      >
        <FaGithub size='25' />
      </MenuItem>

      <MenuButton href='/home'>Restaurants</MenuButton>

      {status === 'authenticated' ? (
        <ButtonsContainer>
          <MenuButton href='/reservations'>Reservations</MenuButton>
          <MenuButton href='/home' onClick={() => signOut()}>
            Sign out
          </MenuButton>
        </ButtonsContainer>
      ) : (
        <ButtonsContainer>
          <MenuButton href='/signin'>Sign in</MenuButton>
          <MenuButton href='/signup'>Sign up</MenuButton>
        </ButtonsContainer>
      )}
    </MenuLinksContainer>
  )
}

const MenuLinksContainer = ({ children }: StackProps) => {
  const { isOpen } = useHeaderCtx()

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
        {children}
      </Stack>
    </Box>
  )
}

const ButtonsContainer = ({ children }: FlexProps) => {
  return (
    <Flex
      gridGap={{ base: '2', md: '4' }}
      direction={{
        base: 'column',
        md: 'row',
      }}
    >
      {children}
    </Flex>
  )
}

interface MenuButtonProps extends TextProps {
  href: string
}

const MenuButton = ({ children, href, onClick }: MenuButtonProps) => {
  const { toggle } = useHeaderCtx()

  return (
    <Link href={href} passHref>
      <ChakraLink _hover={{ outline: 'none' }} onClick={toggle}>
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
      </ChakraLink>
    </Link>
  )
}

const MenuItem = ({ children, href, ...rest }: LinkProps) => {
  const { toggle } = useHeaderCtx()

  return (
    <Link href={href!} passHref>
      <ChakraLink _focus={{ outline: 'none' }} onClick={toggle} {...rest}>
        {children}
      </ChakraLink>
    </Link>
  )
}

export const Logo = () => (
  <MenuItem href='/home'>
    <Image w='40' h='20' src='https://bit.ly/2YFsIhw' alt='Mesavip logo' />
  </MenuItem>
)
