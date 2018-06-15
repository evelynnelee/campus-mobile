import React from 'react'
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import Touchable from '../common/Touchable'
import css from '../../styles/css'
import logger from '../../util/logger'
import { gotoNavigationApp, getHumanizedDuration, platformIOS } from '../../util/general';
import COLOR from '../../styles/ColorConstants'
import LAYOUT from '../../styles/LayoutConstants'

class SpecialEventsDetailView extends React.Component {
	static removeSession(remove, id, title) {
		remove(id)
		logger.trackEvent('Special Events', 'Session Removed: ' + title)
	}

	static addSession(add, id, title) {
		add(id)
		logger.trackEvent('Special Events', 'Session Added: ' + title)
	}

	componentDidMount() {
		const { navigation } = this.props
		const { data } = navigation.state.params

		logger.ga('View Loaded: SpecialEvents Detail: ' + data['talk-title'])
	}

	render() {
		const { navigation, saved } = this.props
		const { data, add, remove } = navigation.state.params

		// Talk Description
		let talkDescription = null
		if (data['full-description'].length > 0) {
			talkDescription = (
				<Text style={styles.sessionDesc}>
					{data['full-description']}
				</Text>
			)
		}
		else if (data.speakers) {
			talkDescription = (
				data.speakers.map((object, i) => (
					<View style={styles.speakerContainer} key={String(object.name) + String(i)}>
						<Text style={styles.speakerSubTalkTitle}>{object['sub-talk-title']}</Text>
						<Text style={styles.speakerName}>{object.name}</Text>
						<Text style={styles.speakerPosition}>{object.position}</Text>
					</View>
				))
			)
		}

		// Speaker(s) Info
		let speakersInfoElement = null
		if (data['speaker-shortdesc']) {
			speakersInfoElement = (
				<View>
					<Text style={styles.hostedBy}>Hosted By</Text>
					<View style={styles.speakerContainer}>
						<Text style={styles.speakerName}>{data['speaker-shortdesc']}</Text>
					</View>
				</View>
			)
		}

		return (
			<ScrollView style={css.scroll_default} contentContainerStyle={css.main_full}>
				<View style={styles.detailContainer}>
					<View style={styles.starButton}>
						<Touchable onPress={() => (
							isSaved(saved, data.id) ? (
								SpecialEventsDetailView.removeSession(remove, data.id, data['talk-title'])
							) : (
								SpecialEventsDetailView.addSession(add, data.id, data['talk-title'])
							)
						)}
						>
							<View style={styles.starButtonInner}>
								<Icon
									name="ios-star-outline"
									size={32}
									style={styles.starOuterIcon}
								/>
								{ isSaved(saved, data.id)  ? (
									<Icon
										name="ios-star"
										size={26}
										style={styles.starInnerIcon}
									/>
								) : null }
							</View>
						</Touchable>
					</View>

					<View style={styles.labelView}>
						{ data.label ? (
							<Text style={[styles.labelText, { color: data['label-theme'] ? data['label-theme'] : COLOR.BLACK }]}>{data.label}</Text>
						) : null }
						{ data.label || data['talk-type'] === 'Keynote' ? (
							<Text style={styles.labelText}> - </Text>
						) : null }
						<Text style={styles.labelText}>{getHumanizedDuration(data['start-time'], data['end-time'])}</Text>
					</View>

					<Text style={styles.sessionName}>
						{data['talk-title']}
					</Text>
					<Text style={styles.sessionInfo}>
						{data.location} - {moment(Number(data['start-time'])).format('MMM Do YYYY, h:mm a')}
					</Text>

					{talkDescription}

					{(data.directions && data.directions.latitude && data.directions.longitude) ? (
						<Touchable
							underlayColor="rgba(200,200,200,.1)"
							onPress={() => gotoNavigationApp(data.directions.latitude, data.directions.longitude)}
						>
							<View style={styles.sed_dir}>
								<Text style={styles.sed_dir_label}>Directions</Text>
								<Icon name="md-walk" size={32} style={styles.sed_dir_icon} />
							</View>
						</Touchable>
					) : null }
					{speakersInfoElement}
				</View>
			</ScrollView>
		)
	}
}

function isSaved(savedArray, id) {
	if (Array.isArray(savedArray)) {
		for ( let i = 0; i < savedArray.length; ++i) {
			if (savedArray[i] === id) {
				return true
			}
		}
	}
	return false
}

const mapStateToProps = state => ({ saved: state.specialEvents.saved })

const ActualSpecialEventsDetailView = connect(mapStateToProps)(SpecialEventsDetailView)

const styles = StyleSheet.create({
	detailContainer: { width: LAYOUT.WINDOW_WIDTH, padding: 12 },
	labelView: { flexDirection: 'row', paddingTop: 4 },
	labelText: { fontSize: 13 },
	sessionName: { fontSize: 24, color: COLOR.PRIMARY, paddingTop: 6 },
	sessionInfo: { fontSize: 12, paddingTop: 16  },
	sessionDesc: { lineHeight: 18, fontSize: 14, paddingTop: 16 },
	hostedBy: { fontSize: 10, fontWeight: 'bold', marginTop: 16 },
	speakerContainer: { marginTop: 2 },
	speakerName: { fontSize: 14, fontWeight: 'bold', color: COLOR.PRIMARY, marginTop: 10 },
	speakerPosition: { fontSize: 10, marginTop: 2 },
	speakerSubTalkTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },
	starButton: { width: 50, position: 'absolute', top: 2, right: -5, zIndex: 10 },
	starButtonInner: { justifyContent: 'flex-start', alignItems: 'center' },
	starOuterIcon: { color: COLOR.DGREY, position: platformIOS() ? 'absolute' : 'relative', zIndex: 10, backgroundColor: 'transparent' },
	starInnerIcon: { color: COLOR.YELLOW, position: 'absolute', zIndex: platformIOS() ? 5 : 15, marginTop: 3 },
	sed_dir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLOR.MGREY, marginTop: 16, paddingVertical: 6 },
	sed_dir_icon: { color: COLOR.PRIMARY, alignSelf: 'flex-end' },
	sed_dir_label: { flex: 1, fontSize: 22, color: COLOR.PRIMARY },
})

export default ActualSpecialEventsDetailView
