import { fireEvent, render, screen } from "@testing-library/react"
import TimesParameters from "./TimesParameters"
import { DateTime } from "luxon"
import { SuntimesViewType } from "@/interfaces/Suntimes"

describe('TimesParameters component', () => {

    it('renders date inputs', () => {
        let from = DateTime.now()
        let viewType = SuntimesViewType.SUN
        render(<TimesParameters from={from} updateFrom={(e) => from = e} viewType={viewType} updateViewType={(e) => viewType = e} />)

        expect(screen.getByLabelText('date')).toBeInTheDocument()
        expect(screen.getByTitle('previous')).toBeInTheDocument()
        expect(screen.getByTitle('next')).toBeInTheDocument()
    })

    it('changes to previous date via button', () => {
        let from = DateTime.now()
        let viewType = SuntimesViewType.SUN

        const updateFrom = jest.fn()
        render(<TimesParameters from={from} updateFrom={updateFrom} viewType={viewType} updateViewType={(e) => viewType = e} />)

        const previousButton = screen.getByTitle('previous')
        fireEvent.click(previousButton)

        expect(updateFrom).toHaveBeenCalledWith(from.plus({ month: -1 }).startOf('month'))
    })

    it('changes to next date via button', () => {
        let from = DateTime.now()
        let viewType = SuntimesViewType.SUN

        const updateFrom = jest.fn()
        render(<TimesParameters from={from} updateFrom={updateFrom} viewType={viewType} updateViewType={(e) => viewType = e} />)

        const nextButton = screen.getByTitle('next')
        fireEvent.click(nextButton)

        expect(updateFrom).toHaveBeenCalledWith(from.plus({ month: 1 }).startOf('month'))
    })

    it('renders SuntimesViewType values', () => {
        const suntimesViewTypes = Object.values(SuntimesViewType)

        let from = DateTime.now()
        let viewType = SuntimesViewType.SUN
        render(<TimesParameters from={from} updateFrom={(e) => from = e} viewType={viewType} updateViewType={(e) => viewType = e} />)


        const values = screen.getAllByRole('option')
        expect(values).toHaveLength(suntimesViewTypes.length)
    })
})