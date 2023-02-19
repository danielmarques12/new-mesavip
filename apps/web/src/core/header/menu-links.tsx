import { Box, Flex, Stack, Text, TextProps } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

import { useHeaderCtx } from '.'

export const HeaderMenu = () => {
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
          href='https://github.com/danielmarques12/mesavip'
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
