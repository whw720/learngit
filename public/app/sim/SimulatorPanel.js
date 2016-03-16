Ext.define('com.dfsoft.lancet.sim.SimulatorPanel', {
	extend: 'Ext.panel.Panel',

	id: 'sim-simulator-viewport',

	initComponent: function() {
		var me = this;
		me.callParent();
	},

    layout: 'border',
    height: 560,
	items: [{
		region: 'center',
		border: false,
		margins: '-1 0 0 -1',
		bodyStyle: {
			'background-color': 'black'
		},
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		items: [{
			xtype: 'panel',
			id: 'simulator-ecg-chart-panel',
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 60,
			border: false,
			style: 'padding: 10px 0px 0px 5px',
			layout: 'fit'
		}, {
			xtype: 'panel',
			id: 'simulator-spo2-chart-panel',
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 60,
			border: false,
			style: 'padding: 10px 0px 0px 5px',
			layout: 'fit'
		}, {
			xtype: 'panel',
			id: 'simulator-art-chart-panel',
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 60,
			border: false,
			style: 'padding: 10px 0px 0px 5px',
			layout: 'fit'
		}, {
			xtype: 'panel',
			id: 'simulator-cvp-chart-panel',
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 60,
			border: false,
			style: 'padding: 10px 0px 0px 5px',
			layout: 'fit'
		}, {
			xtype: 'panel',
			id: 'simulator-co2-chart-panel',
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 60,
			border: false,
			style: 'padding: 10px 0px 0px 5px',
			layout: 'fit'
		}, {
			xtype: 'panel',
			id: 'simulator-paw-chart-panel',
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 60,
			border: false,
			style: 'padding: 10px 0px 0px 5px',
			layout: 'fit'
		}, {
			xtype: 'panel',
			id: 'simulator-flow-chart-panel',
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 60,
			border: false,
			style: 'padding: 10px 0px 0px 5px',
			layout: 'fit'
		}, {
			xtype: 'panel',
			id: 'simulator-bis-chart-panel',
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 60,
			border: false,
			style: 'padding: 0px 0px 0px 5px',
			layout: 'fit'
		}]
	}, {
		region: 'east',
		width: 290,
		border: false,
		margins: '-1 -1 0 -1',
		bodyStyle: {
			'background-color': 'black'
		},
		layout: {
		    type: 'vbox',
		    align: 'stretch'
		},
		items: [{
			//-----------------------------ECG开始--------------------------------------
			xtype: 'panel',
			bodyStyle: {
				'background-color': 'black'
			},
			defaults: {
				bodyStyle: {
					'background-color': 'transparent'
				},
				height: 60,
				border: false
			},
			layout:'column',
			items: [{
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'ECG',
					style: 'color: chartreuse; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '100',
					style: 'color: darkgreen;'
				}, {
					xtype: 'label',
					text: '60',
					style: 'color: darkgreen;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .3,
				style: 'padding-left: 5px;',
				items: [{
					xtype: 'label',
					id: 'simulator-hr',
					text: '60',
					style: 'color: chartreuse; font-size: 64px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .15,
				items: [{
					xtype: 'label',
					text: '',
					style: 'color: chartreuse'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'PVC',
					style: 'color: chartreuse; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: 'ST',
					style: 'color: chartreuse; padding-top: 15px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .2,
				layout: 'vbox',
				style: 'padding-top: 6px; padding-left: 5px;',
				items: [{
					xtype: 'label',
					text: '8',
					style: 'color: chartreuse; font-size: 30px;'
				}, {
					xtype: 'panel',
					layout: 'hbox',
					bodyStyle: {
						'background-color': 'transparent'
					},
					items: [{
						xtype: 'label',
						text: 'Ⅱ',
						style: 'color: darkgreen; font-size: 12px; padding-top: 2px; padding-left: 3px;'
					}, {
						xtype: 'label',
						text: '0.1',
						style: 'color: chartreuse; font-size: 16px; padding-left: 8px;'
					}]
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: '',
					style: ''
				}]
			}]
		}, {
			//-----------------------------SpO2开始--------------------------------------
			xtype: 'panel',
			bodyStyle: {
				'background-color': 'black'
			},
			defaults: {
				bodyStyle: {
					'background-color': 'transparent'
				},
				height: 60,
				border: false
			},
			layout:'column',
			items: [{
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'SpO2',
					style: 'color: turquoise; padding-top: 10px; -webkit-transform: scale(1);'
				}, {
					xtype: 'label',
					text: '100',
					style: 'color: cadetblue;'
				}, {
					xtype: 'label',
					text: '95',
					style: 'color: cadetblue;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .3,
				style: 'padding-left: 5px;',
				items: [{
					xtype: 'label',
					id: 'simulator-spo2',
					text: '95',
					style: 'color: turquoise; font-size: 64px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .15,
				style: 'padding-top: 10px;',
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: '%',
					style: 'color: turquoise;'
				}, {
					xtype: 'label',
					cls: 'progressbar',
					text: '',
					style: 'width: 13px; height: 40px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'PR',
					style: 'color: turquoise; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '100',
					style: 'color: cadetblue;'
				}, {
					xtype: 'label',
					text: '60',
					style: 'color: cadetblue;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .2,
				style: 'padding-top: 24px; padding-left: 5px;',
				items: [{
					xtype: 'label',
					id: 'simulator-pr',
					text: '60',
					style: 'color: turquoise; font-size: 40px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				items: [{
					xtype: 'label',
					text: '',
					style: 'color: turquoise'
				}]
			}]
		}, {
			//-----------------------------ART开始--------------------------------------
			xtype: 'panel',
			bodyStyle: {
				'background-color': 'black'
			},
			defaults: {
				bodyStyle: {
					'background-color': 'transparent'
				},
				height: 60,
				border: false
			},
			layout:'column',
			items: [{
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'ART',
					style: 'color: red; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '130',
					style: 'color: darkred;'
				}, {
					xtype: 'label',
					text: '60',
					style: 'color: darkred;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .3,
				style: 'padding-left: 5px; padding-top: 34px;',
				items: [{
					xtype: 'label',
					id: 'simulator-art-shrink',
					text: '90',
					style: 'color: red; font-size: 26px;'
				}, {
					xtype: 'label',
					text:'/',
					style: 'color: red; font-size: 26px;'
				}, {
					xtype: 'label',
					id: 'simulator-art-diastolic',
					text: '60',
					style: 'color: red; font-size: 26px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .15,
				style: 'padding-top: 10px;',
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'mmHg',
					style: 'color: red;'
				}, {
					xtype: 'label',
					id: 'simulator-art-avg',
					text: '(70)',
					style: 'color: red; font-size: 20px; padding-left: 2px; padding-top: 12px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'RAP',
					style: 'color: orange; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '10',
					style: 'color: sienna;'
				}, {
					xtype: 'label',
					text: '1',
					style: 'color: sienna;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .2,
				style: 'padding-top: 24px; padding-left: 5px;',
				items: [{
					xtype: 'label',
					id: 'simulator-rap',
					text: '1',
					style: 'color: orange; font-size: 40px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				items: [{
					xtype: 'label',
					text: '',
					style: 'color: red'
				}]
			}]
		}, {
			//-----------------------------CVP开始--------------------------------------
			xtype: 'panel',
			bodyStyle: {
				'background-color': 'black'
			},
			defaults: {
				bodyStyle: {
					'background-color': 'transparent'
				},
				height: 60,
				border: false
			},
			layout:'column',
			items: [{
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'CVP',
					style: 'color: slateblue; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '12',
					style: 'color: darkslateblue;'
				}, {
					xtype: 'label',
					text: '2',
					style: 'color: darkslateblue;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .3,
				style: 'padding-left: 5px;',
				items: [{
					xtype: 'label',
					id: 'simulator-cvp',
					text: '2',
					style: 'color: slateblue; font-size: 64px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				style: 'padding-top: 10px;',
				items: [{
					xtype: 'label',
					text: 'mmHg',
					style: 'color: slateblue'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'ICP',
					style: 'color: slateblue; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '15',
					style: 'color: darkslateblue;'
				}, {
					xtype: 'label',
					text: '0',
					style: 'color: darkslateblue;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .2,
				layout: 'vbox',
				style: 'padding-top: 24px; padding-left: 5px;',
				items: [{
					xtype: 'label',
					id: 'simulator-icp',
					text: '15',
					style: 'color: slateblue; font-size: 40px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: '',
					style: 'color: slateblue; padding-top: 50px; font-size: 18px;'
				}]
			}]
		}, {
			//-----------------------------CO2开始--------------------------------------
			xtype: 'panel',
			bodyStyle: {
				'background-color': 'black'
			},
			defaults: {
				bodyStyle: {
					'background-color': 'transparent'
				},
				height: 60,
				border: false
			},
			layout:'column',
			items: [{
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'CO2',
					style: 'color: yellow; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '45',
					style: 'color: olive;'
				}, {
					xtype: 'label',
					text: '35',
					style: 'color: olive;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .3,
				style: 'padding-left: 5px;',
				layout: 'hbox',
				items: [{
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					style: 'padding-top: 19px;',
					items: [{
						xtype: 'label',
						text: 'Et',
						style: 'color: olive; -webkit-transform: scale(0.7);'
					}, {
						xtype: 'label',
						text: 'Fi',
						style: 'color: olive; padding-top: 15px; -webkit-transform: scale(0.7);'
					}]
				}, {
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					style: 'padding-top: 10px; padding-left: 5px;',
					items: [{
						xtype: 'label',
						id: 'simulator-et-co2',
						text: '35',
						style: 'color: yellow; font-size: 24px;'
					}, {
						xtype: 'label',
						id: 'simulator-fi-co2',
						width: 32,
						text: '0',
						style: 'color: yellow; font-size: 24px;'
					}]
				}, {
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					items: [{
						xtype: 'label',
						text:'AWRR',
						style: 'color: yellow; -webkit-transform: scale(0.7); padding-top: 56px; margin-left: -4px;'
					}]
				}]
			}, {
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				style: 'padding-top: 10px;',
				items: [{
					xtype: 'label',
					text: 'mmHg',
					style: 'color: yellow'
				}, {
					xtype: 'label',
					id: 'simulator-awrr',
					text: '12',
					style: 'color: yellow; font-size: 20px; padding-top: 14px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'CO',
					style: 'color: lightgrey; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '8',
					style: 'color: grey;'
				}, {
					xtype: 'label',
					text: '4.8',
					style: 'color: grey;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .2,
				layout: 'vbox',
				style: 'padding-top: 24px; padding-left: 5px;',
				items: [{
					xtype: 'label',
					id: 'simulator-co',
					text: '4',
					style: 'color: lightgrey; font-size: 40px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: '',
					style: 'color: lightgrey; padding-top: 50px; font-size: 18px;'
				}]
			}]
		}, {
			//-----------------------------PAW开始--------------------------------------
			xtype: 'panel',
			bodyStyle: {
				'background-color': 'black'
			},
			defaults: {
				bodyStyle: {
					'background-color': 'transparent'
				},
				height: 60,
				border: false
			},
			layout:'column',
			items: [{
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'PAW',
					style: 'color: slateblue; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: 'S',
					style: 'width: 20px; text-align: center; font-size: 16px; font-weight: bold; margin-top: 16px; margin-left: -2px; background-color: lightslategray;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .3,
				style: 'padding-left: 5px;',
				layout: 'hbox',
				items: [{
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					style: 'padding-top: 19px;',
					items: [{
						xtype: 'label',
						text: 'PIP',
						style: 'color: darkslateblue; width: 28px; -webkit-transform: scale(0.7);'
					}, {
						xtype: 'label',
						text: 'Pplat',
						style: 'color: darkslateblue; width: 28px; padding-top: 15px; -webkit-transform: scale(0.7);'
					}]
				}, {
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					style: 'padding-top: 10px;',
					items: [{
						xtype: 'label',
						id: 'simulator-pip',
						text: '0',
						width: 26,
						style: 'color: slateblue; font-size: 24px;'
					}, {
						xtype: 'label',
						id: 'simulator-pplat',
						width: 26,
						text: '0',
						style: 'color: slateblue; font-size: 24px;'
					}]
				}, {
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					style: 'padding-top: 19px;',
					items: [{
						xtype: 'label',
						text: 'PEEP',
						style: 'color: darkslateblue; width: 28px; -webkit-transform: scale(0.7); margin-left: -2px;'
					}, {
						xtype: 'label',
						text: 'Pmean',
						style: 'color: darkslateblue; width: 28px; padding-top: 15px; -webkit-transform: scale(0.7); margin-left: -2px;'
					}]
				}]
			}, {
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				style: 'padding-top: 10px;',
				items: [{
					xtype: 'label',
					id: 'simulator-peep',
					text: '0',
					style: 'color: slateblue; font-size: 24px;'
				}, {
					xtype: 'label',
					id: 'simulator-pmean',
					text: '0',
					style: 'color: slateblue; font-size: 24px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'VOL',
					style: 'color: slateblue; padding-top: 10px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .2,
				layout: 'vbox',
				style: 'padding-top: 19px; padding-left: 5px;',
				items: [{
					xtype: 'label',
					text: 'TVi',
					style: 'color: darkslateblue; width: 28px; -webkit-transform: scale(0.7);'
				}, {
					xtype: 'label',
					text: 'TVe',
					style: 'color: darkslateblue; width: 28px; padding-top: 15px; -webkit-transform: scale(0.7);'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				style: 'padding-top: 10px; margin-left: -25px;',
				items: [{
					xtype: 'label',
					id: 'simulator-tvi',
					text: '20',
					style: 'color: slateblue; font-size: 24px;'
				}, {
					xtype: 'label',
					id: 'simulator-tve',
					text: '20',
					style: 'color: slateblue; font-size: 24px;'
				}]
			}]
		}, {
			//-----------------------------FLOW开始--------------------------------------
			xtype: 'panel',
			bodyStyle: {
				'background-color': 'black'
			},
			defaults: {
				bodyStyle: {
					'background-color': 'transparent'
				},
				height: 50,
				border: false
			},
			layout:'column',
			items: [{
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'FLOW',
					style: 'color: slateblue; padding-top: 10px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .3,
				style: 'padding-left: 5px;',
				layout: 'hbox',
				items: [{
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					style: 'padding-top: 38px;',
					items: [{
						xtype: 'label',
						text: 'PIF',
						style: 'color: darkslateblue; width: 28px; -webkit-transform: scale(0.7);'
					}]
				}, {
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					style: 'padding-top: 28px;',
					items: [{
						xtype: 'label',
						text: '25',
						style: 'color: slateblue; font-size: 24px;'
					}]
				}, {
					xtype: 'panel',
					layout: 'vbox',
					bodyStyle: 'background-color: transparent',
					style: 'padding-top: 38px;',
					items: [{
						xtype: 'label',
						text: 'PEF',
						style: 'color: darkslateblue; width: 28px; -webkit-transform: scale(0.7);'
					}]
				}]
			}, {
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				style: 'padding-top: 28px;',
				items: [{
					xtype: 'label',
					text: '10',
					style: 'color: slateblue; font-size: 24px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'RR',
					style: 'color: slateblue; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: '20',
					style: 'color: darkslateblue; -webkit-transform: scale(0.7);'
				}, {
					xtype: 'label',
					text: '12',
					style: 'color: darkslateblue; -webkit-transform: scale(0.7); margin-top: -4px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .2,
				layout: 'vbox',
				style: 'padding-top: 14px;',
				items: [{
					xtype: 'label',
					id: 'simulator-rr',
					text: '20',
					style: 'color: slateblue; font-size: 40px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				style: 'padding-top: 10px;',
				items: [{
					xtype: 'label',
					text: '',
					style: 'color: slateblue;'
				}]
			}]
		}, {
			//-----------------------------BIS开始--------------------------------------
			xtype: 'panel',
			bodyStyle: {
				'background-color': 'black'
			},
			defaults: {
				bodyStyle: {
					'background-color': 'transparent'
				},
				height: 60,
				border: false
			},
			layout:'column',
			items: [{
				xtype: 'panel',
				columnWidth: .15,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'BIS',
					style: 'color: yellow; padding-top: 10px; -webkit-transform: scale(1);'
				}, {
					xtype: 'label',
					text: '100',
					style: 'color: olive;'
				}, {
					xtype: 'label',
					text: '20',
					style: 'color: olive;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .3,
				style: 'padding-left: 5px;',
				items: [{
					xtype: 'label',
					id: 'simulator-bis',
					text: '20',
					style: 'color: yellow; font-size: 64px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .15,
				style: 'padding-top: 23px;',
				layout: 'vbox',
				items: [{
					xtype: 'label',
					cls: 'progressbar-1',
					text: '',
					style: 'width: 13px; height: 24px;'
				}, {
					xtype: 'label',
					text: 'EMG',
					style: 'color: yellow; margin-left: -5px; -webkit-transform: scale(0.7);'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				items: [{
					xtype: 'label',
					text: 'SR',
					style: 'color: yellow; padding-top: 10px;'
				}, {
					xtype: 'label',
					text: 'SEF',
					style: 'color: yellow; padding-top: 12px;'
				}]
			}, {
				xtype: 'panel',
				columnWidth: .2,
				style: 'padding-top: 9px; padding-left: 5px;',
				layout: 'vbox',
				items: [{
					xtype: 'panel',
					layout: 'hbox',
					bodyStyle: 'background-color: transparent',
					items: [{
						xtype: 'label',
						text: '54',
						style: 'color: yellow; font-size: 24px;'						
					}, {
						xtype: 'label',
						text: 'SQI',
						style: 'color: yellow; margin-top: -1px; -webkit-transform: scale(0.7);'						
					}]
				}, {
					xtype: 'panel',
					layout: 'hbox',
					bodyStyle: 'background-color: transparent',
					items: [{
						xtype: 'label',
						text: '25',
						style: 'color: yellow; font-size: 24px;'						
					}, {
						xtype: 'label',
						text: 'TP',
						style: 'color: yellow; margin-top: -1px; -webkit-transform: scale(0.7);'						
					}]
				}]
			}, {
				xtype: 'panel',
				columnWidth: .1,
				layout: 'vbox',
				style: 'padding-top: 9px;',
				items: [{
					xtype: 'label',
					text: '80',
					style: 'color: yellow; font-size: 24px;'
				}, {
					xtype: 'label',
					text: '20',
					style: 'color: yellow; font-size: 24px;'
				}]
			}]
		}]
	}, {
		region: 'south',
		height: 80,
		bodyStyle: {
			'background-color': 'black'
		},
		defaults: {
			bodyStyle: {
				'background-color': 'transparent'
			},
			height: 80,
			border: false
		},
		layout:'column',
		items: [{
			//-----------------------------NIBP开始--------------------------------------
			xtype: 'panel',
			columnWidth: .05,
			layout: 'vbox',
			style: 'padding-left: 5px; padding-top: 10px;',
			items: [{
				xtype: 'label',
				text: 'NIBP',
				style: 'color: lightgrey;'
			}, {
				xtype: 'label',
				text: '130',
				style: 'color: grey;'
			}, {
				xtype: 'label',
				text: '60',
				style: 'color: grey;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .15,
			layout: 'hbox',
			style: 'padding-top: 27px;',
			items: [{
				xtype: 'label',
				text: '130',
				id: 'simulator-nibp-shrink',
				style: 'color: lightgrey; font-size: 40px;'
			}, {
				xtype: 'label',
				text: '/',
				style: 'color: lightgrey; font-size: 40px;'
			}, {
				xtype: 'label',
				id: 'simulator-nibp-diastolic',
				text: '90',
				style: 'color: lightgrey; font-size: 40px;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .06,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 10px',
			items: [{
				xtype: 'label',
				id: 'simulator-now-time',
				text: '00:00',
				style: 'color: grey;'
			}, {
				xtype: 'label',
				id: 'simulator-nibp-avg',
				text: '(103)',
				style: 'color: lightgrey; font-size: 20px; padding-top: 18px;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .05,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 10px',
			items: [{
				xtype: 'label',
				text: 'mmHg',
				style: 'color: lightgrey;'
			}]
		}, {
			//-----------------------------O2开始--------------------------------------
			xtype: 'panel',
			columnWidth: .04,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 10px; padding-left: 10px;',
			items: [{
				xtype: 'label',
				text: 'O2',
				style: 'color: chartreuse;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .03,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 27px;',
			items: [{
				xtype: 'label',
				text: 'Et',
				style: 'color: darkgreen; -webkit-transform: scale(0.7);'
			}, {
				xtype: 'label',
				text: 'Fi',
				style: 'color: darkgreen; -webkit-transform: scale(0.7); padding-top: 10px;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .03,
			layout: 'vbox',
			style: 'padding-top: 20px;',
			items: [{
				xtype: 'label',
				id: 'simulator-o2-et',
				text: '21',
				style: 'color: chartreuse; font-size: 20px;'
			}, {
				xtype: 'label',
				id: 'simulator-o2-fi',
				text: '21',
				style: 'color: chartreuse; font-size: 20px;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .05,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 10px',
			items: [{
				xtype: 'label',
				text: 'mmHg',
				style: 'color: chartreuse;'
			}]
		}, {
			//-----------------------------N2O开始--------------------------------------
			xtype: 'panel',
			columnWidth: .05,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 10px; padding-left: 10px;',
			items: [{
				xtype: 'label',
				text: 'N2O',
				style: 'color: turquoise;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .03,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 27px;',
			items: [{
				xtype: 'label',
				text: 'Et',
				style: 'color: darkturquoise; -webkit-transform: scale(0.7);'
			}, {
				xtype: 'label',
				text: 'Fi',
				style: 'color: darkturquoise; -webkit-transform: scale(0.7); padding-top: 10px;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .03,
			layout: 'vbox',
			style: 'padding-top: 20px;',
			items: [{
				xtype: 'label',
				id: 'simulator-n2o-et',
				text: '0',
				style: 'color: turquoise; font-size: 20px;'
			}, {
				xtype: 'label',
				id: 'simulator-n2o-fi',
				text: '0',
				style: 'color: turquoise; font-size: 20px;'
			}]
		}, {
			//-----------------------------ENF开始--------------------------------------
			xtype: 'panel',
			columnWidth: .05,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 10px; padding-left: 10px;',
			items: [{
				xtype: 'label',
				text: 'ENF',
				style: 'color: orange;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .03,
			layout: 'vbox',
			bodyStyle: 'background-color: transparent',
			style: 'padding-top: 27px;',
			items: [{
				xtype: 'label',
				text: 'Et',
				style: 'color: darkgoldenrod; -webkit-transform: scale(0.7);'
			}, {
				xtype: 'label',
				text: 'Fi',
				style: 'color: darkgoldenrod; -webkit-transform: scale(0.7); padding-top: 10px;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .05,
			layout: 'vbox',
			style: 'padding-top: 20px;',
			items: [{
				xtype: 'label',
				id: 'simulator-enf-et',
				text: '0',
				style: 'color: orange; font-size: 20px;'
			}, {
				xtype: 'label',
				id: 'simulator-enf-fi',
				text: '0',
				style: 'color: orange; font-size: 20px;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .08,
			layout: 'hbox',
			items: [{
				xtype: 'label',
				text: 'MAC',
				style: 'color: orange; padding-top: 35px;'
			}, {
				xtype: 'label',
				id: 'simulator-enf-mac',
				text: '0',
				style: 'color: orange; font-size: 20px; padding-left: 5px; padding-top: 32px;'
			}]
		}, {
			//-----------------------------TEMP开始--------------------------------------
			xtype: 'panel',
			columnWidth: .06,
			layout: 'vbox',
			style: 'padding-left: 5px; padding-top: 10px;',
			items: [{
				xtype: 'label',
				text: 'TEMP',
				style: 'color: red;'
			}, {
				xtype: 'label',
				text: '37.5',
				style: 'color: darkred;'
			}, {
				xtype: 'label',
				text: '36',
				style: 'color: darkred;'
			}]
		}, {
			xtype: 'panel',
			columnWidth: .08,
			layout: 'vbox',
			items: [{
				xtype: 'panel',
				layout: 'hbox',
				bodyStyle: 'background-color: transparent',
				items: [{
					xtype: 'label',
					text: 'T1',
					style: 'color: darkred; padding-top: 32px; -webkit-transform: scale(0.7);'
				}, {
					xtype: 'label',
					id: 'simulator-t1',
					text: '36.7',
					style: 'color: red; padding-left: 10px; padding-top: 20px; font-size: 20px;'					
				}]
			}, {
				xtype: 'panel',
				layout: 'hbox',
				bodyStyle: 'background-color: transparent',
				items: [{
					xtype: 'label',
					text: 'T2',
					style: 'color: darkred; padding-top: 4px; -webkit-transform: scale(0.7);'
				}, {
					xtype: 'label',
					text: '------',
					style: 'color: red; padding-left: 10px; font-size: 20px;'
				}]
			}]
		}, {
			xtype: 'panel',
			columnWidth: .085,
			layout: 'vbox',
			items: [{
				xtype: 'label',
				text: '℃',
				style: 'color: red; padding-top: 10px; padding-left: 55px;'
			}, {
				xtype: 'panel',
				layout: 'hbox',
				bodyStyle: 'background-color: transparent',
				items: [{
					xtype: 'label',
					text: 'TD',
					style: 'color: darkred; padding-top: 2px; padding-left: 17px; -webkit-transform: scale(0.7);'
				}, {
					xtype: 'label',
					text: '0.5',
					style: 'color: red; padding-left: 8px; font-size: 20px;'
				}]
			}]
		}]
	}]
});