import { NavLink } from 'react-router-dom'
import { Timer, Scroll } from 'phosphor-react'
import { HeaderContainer } from './styles'

import logoIgnite from '../../assets/Logo.svg'

export function Header() {
	return (
		<HeaderContainer>
			<img src={logoIgnite} alt=""></img>

			<nav>
				<NavLink to="/" title="Timer">
					<Timer size={24}></Timer>
				</NavLink>
				<NavLink to="/history" title="Histórico">
					<Scroll size={24}></Scroll>
				</NavLink>
			</nav>
		</HeaderContainer>
	)
}
