import React from "react"
import { shallow, mount } from "enzyme"
import { spy } from "sinon"

import LowerThird from "../../web/static/js/components/lower_third"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"
import IdeaSubmissionForm from "../../web/static/js/components/idea_submission_form"

import { voteMax } from "../../web/static/js/configs/retro_configs"

describe("LowerThird component", () => {
  const mockRetroChannel = { push: spy(), on: () => {} }
  const stubUser = { given_name: "Mugatu" }
  const votingStage = "voting"
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    users: [],
    ideas: [],
    stage: "idea-generation",
  }

  context("when the current user is facilitator", () => {
    const facilitatorUser = { is_facilitator: true }

    context("and showActionItems is false", () => {
      it("renders the <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird {...defaultProps} currentUser={facilitatorUser} />
        )

        expect(lowerThird.find(StageProgressionButton)).to.have.length(1)
      })
    })

    context("and there are no ideas during the idea-generation stage", () => {
      it("renders a disabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="idea-generation"
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.true
      })
    })

    context("and there are ideas during the idea-generation stage", () => {
      it("renders an enabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="idea-generation"
            ideas={[{ category: "happy" }]}
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })
    })

    context("and there are no action items during the action-items stage", () => {
      it("renders a disabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="action-items"
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.true
      })
    })

    context("and there are action items during the action-items stage", () => {
      it("renders an enabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="action-items"
            ideas={[{ category: "action-item" }]}
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })
    })
  })

  context("when the current user is not facilitator", () => {
    const nonFacilitatorUser = { is_facilitator: false }

    it("does not render <StageProgressionButton>", () => {
      const lowerThird = shallow(
        <LowerThird {...defaultProps} currentUser={nonFacilitatorUser} />
      )

      expect(lowerThird.find(StageProgressionButton)).to.have.length(0)
    })
  })

  context("when the state is closed", () => {
    it("passes `displayContents: false` to the lower third wrapper", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage="closed"
        />
      )

      expect(lowerThird.props().displayContents).to.eql(false)
    })
  })

  context("when the state isn't closed", () => {
    it("passes `displayContents: true` to the lower third wrapper", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage="idea-generation"
        />
      )

      expect(lowerThird.props().displayContents).to.eql(true)
    })
  })

  context("when the stage is voting", () => {
    it("does not render IdeaSubmissionForm", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={votingStage}
        />
      )

      expect(lowerThird.find(IdeaSubmissionForm)).to.have.length(0)
    })

    it("renders 5 Votes Left for a user that hasn't voted yet", () => {
      const lowerThird = mount(
        <LowerThird
          {...defaultProps}
          stage={votingStage}
        />
      )

      expect(lowerThird.text()).to.match(/5.*Votes Left/)
    })

    it("renders the Votes Left for the currentUser", () => {
      const userWithFiveVotes = {
        is_facilitator: false,
        vote_count: voteMax,
      }
      const lowerThird = mount(
        <LowerThird
          {...defaultProps}
          stage={votingStage}
          currentUser={userWithFiveVotes}
        />
      )

      expect(lowerThird.text()).to.match(/0.*Votes Left/)
    })

    it("renders singular Vote if the user has one vote left", () => {
      const userWithFourVotes = {
        is_facilitator: false,
        vote_count: voteMax - 1,
      }
      const lowerThird = mount(
        <LowerThird
          {...defaultProps}
          stage={votingStage}
          currentUser={userWithFourVotes}
        />
      )

      expect(lowerThird.text()).to.match(/1.*Vote Left/)
    })
  })
})