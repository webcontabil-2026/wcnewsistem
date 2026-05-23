@extends('layouts.app')

@section('title', 'WebContabil - Início')
@section('page', 'dashboard')
@section('role', request()->query('role', 'CLIENT'))
