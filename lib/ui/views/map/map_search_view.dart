import 'package:campus_mobile_experimental/core/data_providers/maps_data_provider.dart';
import 'package:campus_mobile_experimental/ui/reusable_widgets/container_view.dart';
import 'package:campus_mobile_experimental/ui/views/map/quick_search_icons.dart';
import 'package:campus_mobile_experimental/ui/views/map/search_bar.dart';
import 'package:campus_mobile_experimental/ui/views/map/search_history_list.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MapSearchView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ContainerView(
      child: Column(
        children: <Widget>[
          Hero(
            tag: 'search_bar',
            child: SearchBar(),
          ),
          QuickSearchIcons(),
          Provider.of<MapsDataProvider>(context).searchHistory.isEmpty
              ? Card(
                  margin: EdgeInsets.all(5),
                  child: Container(
                    width: double.infinity,
                    height: 50,
                    child: Center(child: Text('You have no recent searches')),
                  ),
                )
              : SearchHistoryList()
        ],
      ),
    );
  }
}
