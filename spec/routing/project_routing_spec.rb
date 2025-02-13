#-- copyright
# OpenProject is an open source project management software.
# Copyright (C) 2012-2021 the OpenProject GmbH
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2013 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See COPYRIGHT and LICENSE files for more details.
#++

require 'spec_helper'

describe ProjectsController, type: :routing do
  describe 'index' do
    it do
      expect(get('/projects')).to route_to(
        controller: 'projects', action: 'index'
      )
    end

    it do
      expect(get('/projects.atom')).to route_to(
        controller: 'projects', action: 'index', format: 'atom'
      )
    end

    it do
      expect(get('/projects.xml')).to route_to(
        controller: 'projects', action: 'index', format: 'xml'
      )
    end
  end

  describe 'new' do
    it do
      expect(get('/projects/new')).to route_to(
        controller: 'projects', action: 'new'
      )
    end
  end

  describe 'destroy_info' do
    it do
      expect(get('/projects/123/destroy_info')).to route_to(
        controller: 'projects', action: 'destroy_info', id: '123'
      )
    end
  end

  describe 'delete' do
    it do
      expect(delete('/projects/123')).to route_to(
        controller: 'projects', action: 'destroy', id: '123'
      )
    end

    it do
      expect(delete('/projects/123.xml')).to route_to(
        controller: 'projects', action: 'destroy', id: '123', format: 'xml'
      )
    end
  end

  describe 'miscellaneous' do
    it do
      expect(put('projects/123/modules')).to route_to(
        controller: 'projects', action: 'modules', id: '123'
      )
    end

    it do
      expect(put('projects/123/custom_fields')).to route_to(
        controller: 'projects', action: 'custom_fields', id: '123'
      )
    end

    it do
      expect(put('projects/123/archive')).to route_to(
        controller: 'projects', action: 'archive', id: '123'
      )
    end

    it do
      expect(put('projects/123/unarchive')).to route_to(
        controller: 'projects', action: 'unarchive', id: '123'
      )
    end

    it do
      expect(get('projects/123/copy')).to route_to(
        controller: 'projects', action: 'copy', id: '123'
      )
    end
  end

  describe 'types' do
    it do
      expect(patch('/projects/123/types')).to route_to(
        controller: 'projects', action: 'types', id: '123'
      )
    end
  end

  describe 'level_list' do
    it do
      expect(get('/projects/level_list.json')).to route_to(
        controller: 'projects', action: 'level_list', format: 'json'
      )
    end
  end
end
