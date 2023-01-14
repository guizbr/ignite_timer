import { useContext } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from './styles'

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../context/CyclesContext'

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(1, 'Informe a tarefa'),
	minutesAmount: zod
		.number()
		.min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
		.max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

// interface NewCycleFormData {
// 	task: string,
// 	minutesAmount: number,
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
	const { activeCycle, createNewCycle, interruptCycle } =
		useContext(CyclesContext)

	const newCycleForm = useForm<NewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		},
	})

	const { handleSubmit, watch, reset } = newCycleForm

	function handleCreateNewCycle(data: NewCycleFormData) {
		createNewCycle(data)
		reset()
	}

	const task = watch('task')
	const isSubmitDisabled = !task

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)}>
				<FormProvider {...newCycleForm}>
					<NewCycleForm></NewCycleForm>
				</FormProvider>
				<Countdown></Countdown>

				{activeCycle ? (
					<StopCountdownButton type="button" onClick={interruptCycle}>
						<HandPalm></HandPalm>
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton type="submit" disabled={isSubmitDisabled}>
						<Play></Play>
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	)
}
