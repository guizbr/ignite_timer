import { differenceInSeconds } from 'date-fns'
import {
	createContext,
	ReactNode,
	useEffect,
	useReducer,
	useState,
} from 'react'
import {
	addNewCycleAction,
	interruptedCurrenteCycleAction,
	markCurrenteCycleAsFinishedAction,
} from '../cycle/actions'
import { Cycle, cyclesReducer } from '../cycle/reducer'

interface CreateCycleData {
	task: string
	minutesAmount: number
}

interface CyclesContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	amountSecondsPassed: number
	markCurrentCycleAsFinished: () => void
	setSecondsPassed: (seconds: number) => void
	createNewCycle: (data: CreateCycleData) => void
	interruptCycle: () => void
}

interface CyclesContextProviderProps {
	children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
	children,
}: CyclesContextProviderProps) {
	const [cycleState, dispatch] = useReducer(
		cyclesReducer,
		{
			cycles: [],
			activeCycleId: null,
		},
		() => {
			const storedStateAsJSON = localStorage.getItem(
				'@ignite-timer:cycles-state-1.0.0',
			)

			if (storedStateAsJSON) {
				return JSON.parse(storedStateAsJSON)
			}
		},
	)
	const { cycles, activeCycleId } = cycleState

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

	const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
		if (activeCycle) {
			return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
		}

		return 0
	})

	useEffect(() => {
		const stateJSON = JSON.stringify(cycleState)

		localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
	}, [cycleState])

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds)
	}

	function markCurrentCycleAsFinished() {
		dispatch(markCurrenteCycleAsFinishedAction())
	}

	function createNewCycle(data: CreateCycleData) {
		const id = String(new Date().getTime())

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		}

		dispatch(addNewCycleAction(newCycle))
		setAmountSecondsPassed(0)
	}

	function interruptCycle() {
		dispatch(interruptedCurrenteCycleAction())
	}

	return (
		<CyclesContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				amountSecondsPassed,
				markCurrentCycleAsFinished,
				setSecondsPassed,
				createNewCycle,
				interruptCycle,
			}}
		>
			{children}
		</CyclesContext.Provider>
	)
}
